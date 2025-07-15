fetch(`http://${import.meta.env.VITE_BACKEND_IP}:5000/api/wtc`)
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch trainees');
        return response.json();
    })
    .then(data => {
        const trainees = Array.isArray(data.data) ? data.data : [];
        trainees.forEach(trainee => {
            console.log(`Trainee: ${trainee.name}`);
            console.log(`Picture URL: http://${import.meta.env.VITE_BACKEND_IP}:5000/${trainee.picture}`);
        });
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
