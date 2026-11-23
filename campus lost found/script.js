// Pre-loaded sample data so the portal looks active immediately
const defaultItems = [
    {
        id: 101,
        type: "Lost",
        itemName: "Casio Scientific Calculator fx-991EX",
        category: "Electronics",
        location: "Computer Lab 3, Block B",
        date: "2026-11-20",
        description: "Black calculator with a small scratch on the back cover.",
        contact: "Ananya Verma - 9811223344",
        status: "Active"
    },
    {
        id: 102,
        type: "Found",
        itemName: "BCA 2nd Year Student ID Card",
        category: "ID Cards / Documents",
        location: "Main Canteen",
        date: "2026-11-21",
        description: "Found near the billing counter. Belongs to Rohit Kumar.",
        contact: "Admin Desk - 011-2345678",
        status: "Active"
    },
    {
        id: 103,
        type: "Found",
        itemName: "Blue Stainless Steel Water Bottle",
        category: "Accessories",
        location: "Auditorium Hall",
        date: "2026-11-22",
        description: "Milton bottle left on the front row seat.",
        contact: "Priya Singh - 9988776655",
        status: "Resolved"
    }
];

// Load items from LocalStorage or use default items
let items = JSON.parse(localStorage.getItem('campusItems')) || defaultItems;

const itemForm = document.getElementById('itemForm');
const itemsContainer = document.getElementById('itemsContainer');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');

function saveAndRender() {
    localStorage.setItem('campusItems', JSON.stringify(items));
    updateStats();
    renderItems();
}

function updateStats() {
    document.getElementById('totalCount').innerText = items.length;
    document.getElementById('lostCount').innerText = items.filter(i => i.type === 'Lost' && i.status === 'Active').length;
    document.getElementById('foundCount').innerText = items.filter(i => i.type === 'Found' && i.status === 'Active').length;
    document.getElementById('resolvedCount').innerText = items.filter(i => i.status === 'Resolved').length;
}

function renderItems() {
    const searchText = searchInput.value.toLowerCase();
    const filterValue = filterType.value;

    itemsContainer.innerHTML = '';

    const filtered = items.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchText) || 
                              item.location.toLowerCase().includes(searchText) ||
                              item.category.toLowerCase().includes(searchText);
        
        if (filterValue === 'All') return matchesSearch;
        if (filterValue === 'Resolved') return matchesSearch && item.status === 'Resolved';
        return matchesSearch && item.type === filterValue && item.status === 'Active';
    });

    if (filtered.length === 0) {
        itemsContainer.innerHTML = '<p>No matching records found.</p>';
        return;
    }

    filtered.forEach(item => {
        const badgeClass = item.status === 'Resolved' ? 'badge-Resolved' : `badge-${item.type}`;
        const badgeText = item.status === 'Resolved' ? 'Claimed / Resolved' : item.type;

        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div>
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h3>${item.itemName}</h3>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Details:</strong> ${item.description}</p>
                <p><strong>Contact:</strong> ${item.contact}</p>
            </div>
            <div class="card-actions">
                ${item.status === 'Active' ? `<button class="btn-sm btn-resolve" onclick="markResolved(${item.id})">Mark Claimed</button>` : ''}
                <button class="btn-sm btn-delete" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        itemsContainer.appendChild(card);
    });
}

// Add new item
itemForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newItem = {
        id: Date.now(),
        type: document.getElementById('type').value,
        itemName: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        status: 'Active'
    };

    items.unshift(newItem);
    itemForm.reset();
    saveAndRender();
});

// Mark item as claimed/resolved
window.markResolved = function(id) {
    items = items.map(item => item.id === id ? { ...item, status: 'Resolved' } : item);
    saveAndRender();
};

// Delete item
window.deleteItem = function(id) {
    if (confirm('Are you sure you want to remove this record?')) {
        items = items.filter(item => item.id !== id);
        saveAndRender();
    }
};

searchInput.addEventListener('input', renderItems);
filterType.addEventListener('change', renderItems);

// Initial load
saveAndRender();
