document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let fruits = JSON.parse(localStorage.getItem('freshFruits')) || [];

  // DOM References
  const listSection = document.getElementById('list-section');
  const marketSection = document.getElementById('market-section');
  const fruitGrid = document.getElementById('fruit-grid');
  const fruitForm = document.getElementById('fruit-form');

  // UI Toggle
  const switchView = (view) => {
    const isList = view === 'list';
    listSection.classList.toggle('hidden', !isList);
    marketSection.classList.toggle('hidden', isList);
  };

  document.getElementById('show-list').addEventListener('click', () => switchView('list'));
  document.getElementById('show-market').addEventListener('click', () => switchView('market'));

  // Notification System
  const showToast = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    if (type === 'error') toast.style.background = '#ef4444';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  };

  // Render Function
  const renderFruits = () => {
    fruitGrid.innerHTML = '';
    if (!fruits.length) {
      fruitGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 3rem; background: white; border-radius: var(--radius);">🍇 No fruits listed yet. Be the first seller!</p>`;
      return;
    }

    fruits.forEach((f, i) => {
      const card = document.createElement('article');
      card.className = 'fruit-card';
      card.innerHTML = `
        <div class="fruit-img">
          ${f.image ? `<img src="${f.image}" alt="${f.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.textContent='🍎';">` : '🍇'}
        </div>
        <div class="fruit-info">
          <div class="fruit-name">${f.name}</div>
          <div class="fruit-seller">👤 ${f.seller} • 📅 ${f.date}</div>
          <div class="fruit-price">$${parseFloat(f.price).toFixed(2)} / kg</div>
          <div class="card-actions">
            <button class="buy-btn" data-idx="${i}">🛒 Buy</button>
            <button class="delete-btn" data-idx="${i}">🗑️</button>
          </div>
        </div>
      `;
      fruitGrid.appendChild(card);
    });
  };

  // Form Submission
  fruitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fruit-name').value.trim();
    const price = document.getElementById('fruit-price').value;
    const seller = document.getElementById('seller-name').value.trim();
    const image = document.getElementById('fruit-image').value.trim();

    if (!name || !price || !seller) return;

    const newFruit = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      seller,
      image,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    fruits.unshift(newFruit); // Add to top
    localStorage.setItem('freshFruits', JSON.stringify(fruits));
    renderFruits();
    fruitForm.reset();
    switchView('market');
    showToast('✅ Listing published successfully!');
  });

  // Event Delegation (Buy & Delete)
  fruitGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const idx = btn.dataset.idx;
    const fruit = fruits[idx];

    if (btn.classList.contains('buy-btn')) {
      if (confirm(`Purchase "${fruit.name}" from ${fruit.seller} for $${fruit.price.toFixed(2)}/kg?`)) {
        showToast(`🛒 "${fruit.name}" added to cart! (Demo)`);
        // In production: send to backend/payment gateway
      }
    } else if (btn.classList.contains('delete-btn')) {
      if (confirm('Remove this listing permanently?')) {
        fruits.splice(idx, 1);
        localStorage.setItem('freshFruits', JSON.stringify(fruits));
        renderFruits();
        showToast('🗑️ Listing removed.', 'error');
      }
    }
  });

  // Initial Render
  renderFruits();
});
