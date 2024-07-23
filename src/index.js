document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById("table-body");
    const dogForm = document.getElementById("dog-form");
    let allDogs = [];

  
    function fetchDogs() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => {
                allDogs = dogs;
                displayDogs(dogs);
            })
            .catch(error => console.error("Error fetching dogs:", error));
    }

   
    fetchDogs();

  
    function displayDogs(dogs) {
        tableBody.innerHTML = '';
        dogs.forEach(dog => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='padding center'>${dog.name}</td>
                <td class='padding center'>${dog.breed}</td>
                <td class='padding center'>${dog.sex}</td>
                <td class='padding center'>
                    <button class='edit-btn' data-id='${dog.id}'>Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", handleEditClick);
        });
    }

  
    function handleEditClick(event) {
        const dogId = event.target.dataset.id;
        console.log(`Editing dog with ID: ${dogId}`);
        const dog = allDogs.find(dog => dog.id == dogId);
        if (dog) {
            dogForm.name.value = dog.name;
            dogForm.breed.value = dog.breed;
            dogForm.sex.value = dog.sex;
            dogForm.dataset.id = dog.id;
            console.log(`Form dataset ID set to: ${dog.id}`); 
        } else {
            console.error(`Dog with ID ${dogId} not found.`);
        }
    }

   
    dogForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const dogId = dogForm.dataset.id;
        if (!dogId) {
            console.error("No dog ID found in form dataset.");
            return;
        }
        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value,
        };

        fetch(`http://localhost:3000/dogs/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDog),
        })
        .then(response => response.json())
        .then(() => {
            console.log(`Dog with ID ${dogId} updated successfully.`); 
            fetchDogs();  
            dogForm.reset();
            delete dogForm.dataset.id; 
        })
        .catch(error => {
            console.error("Error updating dog:", error);
        });
    });
});