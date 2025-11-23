// Shopping Cart Logic
// Handles quantity updates, total price calculation, removal, likes, and persistence.

(function () {
	const STORAGE_KEY = 'shopping_cart';
	const listProductsEl = document.querySelector('.list-products');
	const totalEl = document.querySelector('.total');

	if (!listProductsEl || !totalEl) return; // Defensive: required elements missing.

	// Load existing cart from localStorage
	const stored = safeParse(localStorage.getItem(STORAGE_KEY)) || {};

	// Initialize quantities from storage
	document.querySelectorAll('.card').forEach((card) => {
		const title = getTitle(card);
		const qty = stored[title] || 0;
		setQuantity(card, qty);
	});
	updateTotal();

	// Event delegation for all interactive icons
	listProductsEl.addEventListener('click', (e) => {
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		const card = target.closest('.card');
		if (!card) return;

		// Plus
		if (target.classList.contains('fa-plus-circle')) {
			changeQuantity(card, 1);
		}
		// Minus
		else if (target.classList.contains('fa-minus-circle')) {
			changeQuantity(card, -1);
		}
		// Trash
		else if (target.classList.contains('fa-trash-alt')) {
			setQuantity(card, 0);
			persistCard(card);
			updateTotal();
		}
		// Heart (like)
		else if (target.classList.contains('fa-heart')) {
			toggleLike(target);
		}
	});

	function changeQuantity(card, delta) {
		const current = getQuantity(card);
		const next = Math.max(0, current + delta);
		setQuantity(card, next);
		persistCard(card);
		updateTotal();
	}

	function persistCard(card) {
		const title = getTitle(card);
		const qty = getQuantity(card);
		const cart = safeParse(localStorage.getItem(STORAGE_KEY)) || {};
		if (qty > 0) cart[title] = qty; else delete cart[title];
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
	}

	function updateTotal() {
		let total = 0;
		document.querySelectorAll('.card').forEach((card) => {
			const price = getUnitPrice(card);
			const qty = getQuantity(card);
			total += price * qty;
		});
		totalEl.textContent = `${total.toFixed(2)} $`;
	}

	function getUnitPrice(card) {
		const priceEl = card.querySelector('.unit-price');
		if (!priceEl) return 0;
		const raw = priceEl.textContent || '';
		const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
		return isNaN(num) ? 0 : num;
	}

	function getQuantity(card) {
		const qtyEl = card.querySelector('.quantity');
		if (!qtyEl) return 0;
		return parseInt(qtyEl.textContent, 10) || 0;
	}

	function setQuantity(card, value) {
		const qtyEl = card.querySelector('.quantity');
		if (qtyEl) qtyEl.textContent = value;
	}

	function getTitle(card) {
		const titleEl = card.querySelector('.card-title');
		return titleEl ? titleEl.textContent.trim() : 'unknown';
	}

	function toggleLike(iconEl) {
		iconEl.classList.toggle('liked');
		// Simple visual feedback
		if (iconEl.classList.contains('liked')) {
			iconEl.style.color = 'red';
		} else {
			iconEl.style.color = '';
		}
	}

	function safeParse(str) {
		try {
			return JSON.parse(str);
		} catch (_) {
			return null;
		}
	}
})();

