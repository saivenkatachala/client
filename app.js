// app.js

document.getElementById('memberForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const chittiNumber = parseInt(document.getElementById('chittiNumber').value);
    const month = document.getElementById('month').value;
    const amountPaid = parseFloat(document.getElementById('amountPaid').value);
    const paymentStatus = document.getElementById('paymentStatus').checked;
    const paymentDate = document.getElementById('paymentDate').value;

    const response = await fetch('http://localhost:8081/add_member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, chittiNumber, month, amountPaid, paymentStatus, paymentDate })
    });

    const member = await response.json();
    displayMember(member);
    fetchChittiNumbers();
});

async function fetchMembers() {
    const response = await fetch('http://localhost:8081/members');
    const members = await response.json();
    members.forEach(displayMember);
}

async function fetchChittiNumbers() {
    const response = await fetch('http://localhost:8081/members');
    const members = await response.json();
    const chittiNumbers = [...new Set(members.map(member => member.chittiNumber))];
    const chittiSelect = document.getElementById('chittiSelect');
    chittiSelect.innerHTML = '<option value="" disabled selected>Select Chitti Number</option>';
    chittiNumbers.forEach(chittiNumber => {
        const option = document.createElement('option');
        option.value = chittiNumber;
        option.textContent = chittiNumber;
        chittiSelect.appendChild(option);
    });
}

async function fetchChittiMembers() {
    const chittiNumber = document.getElementById('chittiSelect').value;
    const response = await fetch(`http://localhost:8081/member/${chittiNumber}`);
    const members = await response.json();
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';
    members.forEach(displayMember);
}

function displayMember(member) {
    const membersList = document.getElementById('membersList');
    const memberRow = document.createElement('tr');
    memberRow.innerHTML = `
        <td>${member.name}</td>
        <td>${member.chittiNumber}</td>
        <td>${member.month}</td>
        <td>${member.amountPaid}</td>
        <td>${member.paymentStatus ? 'Yes' : 'No'}</td>
        <td>${member.paymentDate}</td>
        <td>
            <button onclick="deleteMember('${member._id}')">Delete</button>
            <button onclick="editMember('${member._id}')">Edit</button>
        </td>
    `;
    membersList.appendChild(memberRow);
}

async function deleteMember(id) {
    await fetch(`http://localhost:8081/delete_member/${id}`, {
        method: 'DELETE'
    });
    fetchChittiMembers();
}

async function editMember(id) {
    const name = prompt("Enter new name:");
    const chittiNumber = prompt("Enter new chitti number:");
    const month = prompt("Enter new month:");
    const amountPaid = prompt("Enter new amount paid:");
    const paymentStatus = confirm("Is payment done?");
    const paymentDate = prompt("Enter new payment date (YYYY-MM-DD):");

    if (name && chittiNumber && month && amountPaid && paymentDate) {
        await fetch(`http://localhost:8081/update_member/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, chittiNumber: parseInt(chittiNumber), month, amountPaid: parseFloat(amountPaid), paymentStatus, paymentDate })
        });
        fetchChittiMembers();
    }
}

function searchMembers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('membersList').getElementsByTagName('tr');

    for (let row of rows) {
        const name = row.getElementsByTagName('td')[0];
        if (name) {
            const textValue = name.textContent.toLowerCase();
            if (textValue.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}
