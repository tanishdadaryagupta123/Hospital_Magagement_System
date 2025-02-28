const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('nic', nic);
    formData.append('dob', dob);
    formData.append('gender', gender);
    formData.append('password', password);
    formData.append('doctorDepartment', doctorDepartment);
    formData.append('docAvatar', docAvatar); // Make sure docAvatar is a File object

    try {
        const response = await fetch('https://hospital-magagement-system.onrender.com/api/v1/user/doctor/addnew', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.API_KEY,
            },
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            console.log("Doctor added successfully:", data);
            // Handle success (e.g., show success message, redirect)
        } else {
            console.error("Failed to add doctor:", data.message);
            // Handle error (e.g., show error message)
        }
    } catch (error) {
        console.error("Error adding doctor:", error);
        // Handle error
    }
}; 