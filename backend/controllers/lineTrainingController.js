const { generateTicketNumber } = require("../utils/ticketGenerator");

class LineTrainingController {
  constructor(lineTrainingModel) {
    this.lineTrainingModel = lineTrainingModel;
  }

  // Create records (one per ticket)
  async createCandidate(req, res) {
    try {
      const data = req.body;
      const tickets = Array.isArray(data.ticketNumbers)
        ? data.ticketNumbers
        : [data.ticketNumbers];

      const created = [];
      for (const no of tickets) {
        const cand = {
          ticket_no: no,
          activity_centre: data.activityCentre,
          start_date: data.startDate,
          end_date: data.endDate,
          remark: data.description || "",
        };
        created.push(await this.lineTrainingModel.create(cand));
      }

      return res.status(201).json({
        success: true,
        message: `Line Training created for ${created.length} candidate(s)`,
        data: {
          id: created[0]?.id,
          activityCentre: data.activityCentre,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
          ticketNumbers: tickets,
        },
      });
    } catch (err) {
      console.error("Error creating Line Training:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // List grouped by centre + dates
  async getCandidates(req, res) {
    try {
      const all = await this.lineTrainingModel.getAll();
      const programs = {};

      all.forEach((c) => {
        const key = `${c.activity_centre}_${c.start_date}_${c.end_date}`;
        if (!programs[key]) {
          programs[key] = {
            id: c.id,
            activityCentre: c.activity_centre,
            startDate: c.start_date,
            endDate: c.end_date,
            description: c.remark || "",
            ticketNumbers: [],
          };
        }
        programs[key].ticketNumbers.push(c.ticket_no);
      });

      return res.json({
        success: true,
        message: "Line Training Programs retrieved successfully",
        data: Object.values(programs),
        count: Object.values(programs).length,
      });
    } catch (err) {
      console.error("Error getting Line Training programs:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve" });
    }
  }

  // Compute auto‐status if needed
  determineStatus(start, end) {
    const today = new Date().setHours(0, 0, 0, 0);
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(0, 0, 0, 0);
    if (today < s) return "Scheduled";
    if (today <= e) return "In Progress";
    return "Completed";
  }

  // Get one program by record‐ID
  async getCandidateById(req, res) {
    try {
      const { id } = req.params;
      const c = await this.lineTrainingModel.getById(id);
      if (!c) {
        return res
          .status(404)
          .json({ success: false, message: "Training not found" });
      }

      const all = await this.lineTrainingModel.getAll();
      const group = all.filter(
        (x) =>
          x.activity_centre === c.activity_centre &&
          x.start_date === c.start_date &&
          x.end_date === c.end_date
      );

      return res.json({
        success: true,
        message: "Training program retrieved successfully",
        data: {
          id,
          activityCentre: c.activity_centre,
          startDate: c.start_date,
          endDate: c.end_date,
          description: c.remark || "",
          status: this.determineStatus(c.start_date, c.end_date),
          ticketNumbers: group.map((x) => x.ticket_no),
        },
      });
    } catch (err) {
      console.error("Error getting training program:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to retrieve" });
    }
  }

  // Update entire program (delete + recreate)
  async updateCandidate(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      // find existing record
      const existing = await this.lineTrainingModel.getById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Training not found" });
      }

      // remove old group
      const all = await this.lineTrainingModel.getAll();
      const group = all.filter(
        (x) =>
          x.activity_centre === existing.activity_centre &&
          x.start_date === existing.start_date &&
          x.end_date === existing.end_date
      );
      for (const x of group) {
        await this.lineTrainingModel.deleteByTicketNumber(x.ticket_no);
      }

      // recreate
      const tickets = Array.isArray(data.ticketNumbers)
        ? data.ticketNumbers
        : [data.ticketNumbers];
      const created = [];
      for (const no of tickets) {
        const cand = {
          ticket_no: no,
          activity_centre: data.activityCentre,
          start_date: data.startDate,
          end_date: data.endDate,
          remark: data.description || "",
        };
        created.push(await this.lineTrainingModel.create(cand));
      }

      return res.json({
        success: true,
        message: "Training program updated successfully",
        data: {
          id: created[0]?.id,
          activityCentre: data.activityCentre,
          startDate: data.startDate,
          endDate: data.endDate,
          ticketNumbers: tickets,
        },
      });
    } catch (err) {
      console.error("Error updating training program:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Delete entire program by ID
  async deleteCandidate(req, res) {
    try {
      const { id } = req.params;
      const existing = await this.lineTrainingModel.getById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Training not found" });
      }

      const all = await this.lineTrainingModel.getAll();
      const group = all.filter(
        (x) =>
          x.activity_centre === existing.activity_centre &&
          x.start_date === existing.start_date &&
          x.end_date === existing.end_date
      );
      for (const x of group) {
        await this.lineTrainingModel.deleteByTicketNumber(x.ticket_no);
      }

      return res.json({
        success: true,
        message: "Training program deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting training program:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete" });
    }
  }

  // ── STATUS UPDATE ──
  async updateTrainingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const valid = [
        "Scheduled",
        "In Progress",
        "Completed",
        "Cancelled",
        "On Hold",
      ];
      if (!valid.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: " + valid.join(", "),
        });
      }

      // find one
      const c = await this.lineTrainingModel.getById(id);
      if (!c) {
        return res
          .status(404)
          .json({ success: false, message: "Training not found" });
      }

      // update entire group - FIX: Only update remark field to avoid constraint violation
      const all = await this.lineTrainingModel.getAll();
      const group = all.filter(
        (x) =>
          x.activity_centre === c.activity_centre &&
          x.start_date === c.start_date &&
          x.end_date === c.end_date
      );

      for (const m of group) {
        // Parse existing remark to preserve description
        let existingDesc = "";
        if (m.remark) {
          if (m.remark.startsWith("STATUS:")) {
            const parts = m.remark.split("|");
            if (parts.length > 1) {
              existingDesc = parts.slice(1).join("|");
            }
          } else {
            existingDesc = m.remark;
          }
        }

        // Build new remark with status
        const newRemark = existingDesc
          ? `STATUS:${status}|${existingDesc}`
          : `STATUS:${status}`;

        // Only update the remark field - pass minimal data to avoid constraint issues
        await this.lineTrainingModel.updateByTicketNumber(m.ticket_no, {
          remark: newRemark,
        });
      }

      return res.json({
        success: true,
        message: "Training status updated successfully",
        data: { id, status },
      });
    } catch (err) {
      console.error("Error updating training status:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update status" });
    }
  }
}

module.exports = LineTrainingController;
