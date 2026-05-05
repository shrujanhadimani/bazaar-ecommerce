import { useState } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────────────
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(link);

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Books"];
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const statusMeta = {
  Delivered: { bg: "#D1FAE5", c: "#065F46" },
  Shipped: { bg: "#DBEAFE", c: "#1E40AF" },
  Processing: { bg: "#FEF3C7", c: "#92400E" },
  Cancelled: { bg: "#FEE2E2", c: "#991B1B" },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    category: "Electronics",
    price: 2999,
    stock: 15,
    image: "🎧",
    description: "Noise-cancelling, 30hr battery, foldable design.",
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    category: "Electronics",
    price: 5499,
    stock: 8,
    image: "⌚",
    description: "GPS, SpO2 sensor, AMOLED always-on display.",
  },
  {
    id: 3,
    name: "Mechanical Keyboard TKL",
    category: "Electronics",
    price: 1599,
    stock: 20,
    image: "⌨️",
    description: "Tactile switches, per-key RGB, aluminium frame.",
  },
  {
    id: 4,
    name: "Premium Leather Jacket",
    category: "Fashion",
    price: 3999,
    stock: 5,
    image: "🧥",
    description: "Full-grain leather, quilted inner lining.",
  },
  {
    id: 5,
    name: "Cloud Run Sneakers",
    category: "Fashion",
    price: 1299,
    stock: 12,
    image: "👟",
    description: "Responsive foam sole, breathable mesh upper.",
  },
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    category: "Home",
    price: 599,
    stock: 30,
    image: "☕",
    description: "Set of 4 handcrafted mugs, 350 ml each.",
  },
  {
    id: 7,
    name: "Scented Candle Trio",
    category: "Home",
    price: 899,
    stock: 25,
    image: "🕯️",
    description: "Vanilla · Cedarwood · Jasmine, 40hr burn each.",
  },
  {
    id: 8,
    name: "Design Thinking Handbook",
    category: "Books",
    price: 449,
    stock: 40,
    image: "📚",
    description: "Human-centered design from ideation to launch.",
  },
];

const SEED_ORDERS = [
  {
    id: "ORD-001",
    date: "2025-03-15",
    items: [{ name: "Wireless Headphones Pro", qty: 1, price: 2999 }],
    total: 2999,
    status: "Delivered",
  },
  {
    id: "ORD-002",
    date: "2025-04-02",
    items: [{ name: "Ceramic Coffee Mug Set", qty: 2, price: 599 }],
    total: 1198,
    status: "Shipped",
  },
];

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F6F3",
  card: "#FFFFFF",
  nav: "#0F172A",
  navText: "#F1F5F9",
  accent: "#D97706",
  accentHover: "#B45309",
  accentLight: "#FEF3C7",
  accentText: "#92400E",
  text: "#0F172A",
  muted: "#6B7280",
  border: "#E5E7EB",
  success: "#065F46",
  successBg: "#D1FAE5",
  danger: "#991B1B",
  dangerBg: "#FEE2E2",
  info: "#1E40AF",
  infoBg: "#DBEAFE",
  warn: "#92400E",
  warnBg: "#FEF3C7",
};

// ─── Micro Components ─────────────────────────────────────────────────────────
const Badge = ({ label, color, bg }) => (
  <span
    style={{
      background: bg,
      color,
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {label}
  </span>
);

const Btn = ({
  onClick,
  children,
  variant = "primary",
  style: sx = {},
  disabled,
}) => {
  const base = {
    border: "none",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.15s",
    opacity: disabled ? 0.5 : 1,
    ...sx,
  };
  const variants = {
    primary: { background: C.accent, color: "#111", padding: "9px 18px" },
    ghost: { background: "#F3F4F6", color: C.text, padding: "9px 18px" },
    danger: { background: C.dangerBg, color: C.danger, padding: "6px 14px" },
    info: { background: C.infoBg, color: C.info, padding: "6px 14px" },
    icon: {
      background: C.card,
      color: C.muted,
      border: `1px solid ${C.border}`,
      padding: "4px 10px",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && (
      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: C.muted,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </label>
    )}
    <input
      {...props}
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        border: `1.5px solid ${C.border}`,
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        outline: "none",
        background: C.card,
        color: C.text,
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  </div>
);

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.email || !form.password)
      return setErr("Email and password are required.");
    if (mode === "register" && !form.name) return setErr("Name is required.");
    // POST /api/auth/register or POST /api/auth/login
    onLogin({
      name: form.name || form.email.split("@")[0],
      email: form.email,
      role: form.role,
      initials: (form.name || form.email).slice(0, 2).toUpperCase(),
    });
  };

  const roleBtn = (r, label) => (
    <button
      key={r}
      onClick={() => setForm((f) => ({ ...f, role: r }))}
      style={{
        flex: 1,
        padding: "9px",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: form.role === r ? 600 : 400,
        background: form.role === r ? C.card : "transparent",
        color: form.role === r ? C.text : C.muted,
        boxShadow: form.role === r ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: C.nav,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          background: C.card,
          borderRadius: 18,
          padding: "40px 36px",
          width: 380,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: C.accent,
              letterSpacing: -1,
            }}
          >
            BAZAAR
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            background: "#F3F4F6",
            borderRadius: 10,
            padding: 4,
            marginBottom: 20,
            gap: 4,
          }}
        >
          {roleBtn("customer", "👤 Customer")}
          {roleBtn("admin", "🛠 Admin")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <Input
              label="Full Name"
              placeholder="Shrujan"
              value={form.name}
              onChange={set("name")}
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
          />
          {err && <div style={{ color: C.danger, fontSize: 13 }}>{err}</div>}
          <button
            onClick={submit}
            style={{
              background: C.accent,
              color: "#111",
              border: "none",
              padding: "13px",
              borderRadius: 9,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Syne', sans-serif",
              marginTop: 4,
            }}
          >
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: C.muted,
          }}
        >
          {mode === "login" ? "New here? " : "Already have an account? "}
          <span
            style={{ color: C.accent, cursor: "pointer", fontWeight: 600 }}
            onClick={() => {
              setMode((m) => (m === "login" ? "register" : "login"));
              setErr("");
            }}
          >
            {mode === "login" ? "Register" : "Sign In"}
          </span>
        </div>

        <div
          style={{
            marginTop: 24,
            background: "#F9FAFB",
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 12,
            color: C.muted,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 5 }}>
            DEMO CREDENTIALS
          </div>
          <div>Any email + password works.</div>
          <div>Toggle role tab to switch between Customer / Admin.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, view, setView, cartCount, onLogout }) {
  const links =
    user.role === "customer"
      ? [
          { id: "catalog", label: "Shop" },
          { id: "cart", label: "Cart", badge: cartCount },
          { id: "orders", label: "My Orders" },
        ]
      : [
          { id: "dashboard", label: "📊 Dashboard" },
          { id: "products", label: "📦 Products" },
        ];

  return (
    <nav
      style={{
        background: C.nav,
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 58,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 800,
          color: C.accent,
          letterSpacing: -0.5,
        }}
      >
        BAZAAR
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => setView(l.id)}
            style={{
              background: view === l.id ? C.accent : "transparent",
              color: view === l.id ? "#111" : "#94A3B8",
              border: "none",
              padding: "6px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: view === l.id ? 700 : 400,
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {l.label}
            {l.badge > 0 && (
              <span
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                }}
              >
                {l.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13, color: "#64748B" }}>{user.name}</div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: C.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {user.initials}
        </div>
        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "1px solid #1E293B",
            color: "#64748B",
            padding: "5px 12px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p, cartItem, onAdd, onQty }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.card,
        borderRadius: 14,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        transition: "transform 0.15s, box-shadow 0.15s",
        transform: hover ? "translateY(-3px)" : "none",
        boxShadow: hover ? "0 12px 28px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <div
        style={{
          height: 130,
          background: "#F8F7F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 52,
        }}
      >
        {p.image}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: 1.5,
            marginBottom: 4,
          }}
        >
          {p.category.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 6,
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.55,
            marginBottom: 14,
            minHeight: 38,
          }}
        >
          {p.description}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              {fmt(p.price)}
            </div>
            <div
              style={{
                fontSize: 11,
                color:
                  p.stock === 0 ? C.danger : p.stock < 10 ? C.warn : C.success,
                fontWeight: 500,
              }}
            >
              {p.stock === 0
                ? "Out of stock"
                : p.stock < 10
                  ? `Only ${p.stock} left`
                  : `${p.stock} in stock`}
            </div>
          </div>
          {cartItem ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => onQty(p.id, -1)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                −
              </button>
              <span
                style={{
                  fontWeight: 700,
                  minWidth: 22,
                  textAlign: "center",
                  fontSize: 15,
                }}
              >
                {cartItem.qty}
              </span>
              <button
                onClick={() => onQty(p.id, 1)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: "none",
                  background: C.accent,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
          ) : (
            <Btn
              onClick={() => onAdd(p)}
              disabled={p.stock === 0}
              variant={p.stock === 0 ? "ghost" : "primary"}
            >
              {p.stock === 0 ? "Sold Out" : "Add to Cart"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Catalog View ─────────────────────────────────────────────────────────────
// GET /api/products — fetches all products with optional ?category=&search=
function CatalogView({ products, cart, onAdd, onQty }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.nav} 0%, #1E293B 100%)`,
          borderRadius: 16,
          padding: "36px 40px",
          marginBottom: 32,
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: C.accent,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          DISCOVER · EXPLORE · BUY
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 38,
            fontWeight: 800,
            margin: "0 0 8px",
            lineHeight: 1.1,
            color: "#F1F5F9",
          }}
        >
          Premium Products
          <br />
          at Your Fingertips
        </h1>
        <p style={{ color: "#64748B", margin: 0, fontSize: 15 }}>
          {products.length} curated items across {CATEGORIES.length - 1}{" "}
          categories
        </p>
      </div>

      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "10px 16px",
            borderRadius: 10,
            border: `1.5px solid ${C.border}`,
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            background: C.card,
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1.5px solid ${cat === c ? C.accent : C.border}`,
                background: cat === c ? C.accentLight : C.card,
                color: cat === c ? C.accentText : C.muted,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: cat === c ? 700 : 400,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            No products found for "{search}"
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              cartItem={cart.find((i) => i.id === p.id)}
              onAdd={onAdd}
              onQty={onQty}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cart View ────────────────────────────────────────────────────────────────
// POST /api/orders — checkout creates an order
function CartView({ cart, onQty, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Your cart is empty
        </div>
        <div style={{ color: C.muted, fontSize: 15 }}>
          Add products from the catalog to get started.
        </div>
      </div>
    );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Cart{" "}
        <span
          style={{
            fontSize: 16,
            color: C.muted,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
          }}
        >
          ({count} {count === 1 ? "item" : "items"})
        </span>
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 36,
                width: 54,
                height: 54,
                background: "#F8F7F4",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {item.image}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {item.name}
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                {item.category}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => onQty(item.id, -1)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                −
              </button>
              <span
                style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}
              >
                {item.qty}
              </span>
              <button
                onClick={() => onQty(item.id, 1)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: "none",
                  background: C.accent,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 16,
                minWidth: 88,
                textAlign: "right",
              }}
            >
              {fmt(item.price * item.qty)}
            </div>
            <button
              onClick={() => onRemove(item.id)}
              style={{
                background: C.dangerBg,
                color: C.danger,
                border: "none",
                width: 28,
                height: 28,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "24px 28px",
        }}
      >
        {[
          ["Subtotal", fmt(total)],
          ["Shipping", "Free"],
          ["Tax (18% GST)", fmt(Math.round(total * 0.18))],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              color: C.muted,
              fontSize: 14,
            }}
          >
            <span>{k}</span>
            <span
              style={
                k === "Shipping" ? { color: C.success, fontWeight: 600 } : {}
              }
            >
              {v}
            </span>
          </div>
        ))}
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            {fmt(total + Math.round(total * 0.18))}
          </span>
        </div>
        <button
          onClick={onCheckout}
          style={{
            width: "100%",
            background: C.accent,
            color: "#111",
            border: "none",
            padding: "14px",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Place Order →
        </button>
        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 12,
            color: C.muted,
          }}
        >
          Calls POST /api/orders on checkout
        </div>
      </div>
    </div>
  );
}

// ─── Orders View ──────────────────────────────────────────────────────────────
// GET /api/orders — fetches order history for logged-in user
function OrdersView({ orders }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Order History
      </h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: 16 }}>No orders yet. Go shop!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((o) => {
            const sm = statusMeta[o.status] || statusMeta["Processing"];
            return (
              <div
                key={o.id}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {o.id}
                    </div>
                    <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
                      Placed on {o.date}
                    </div>
                  </div>
                  <Badge label={o.status} color={sm.c} bg={sm.bg} />
                </div>
                <div
                  style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}
                >
                  {o.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        padding: "4px 0",
                        color: C.muted,
                      }}
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: `1px solid ${C.border}`,
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    <span>Order Total</span>
                    <span>{fmt(o.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ products, orders }) {
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 10).length;

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: "📦",
      bg: C.infoBg,
      tc: C.info,
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "🧾",
      bg: C.accentLight,
      tc: C.accentText,
    },
    {
      label: "Revenue (₹)",
      value: fmt(revenue),
      icon: "💰",
      bg: C.successBg,
      tc: C.success,
    },
    {
      label: "Low Stock Items",
      value: lowStock,
      icon: "⚠️",
      bg: C.dangerBg,
      tc: C.danger,
    },
  ];

  return (
    <div>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        Admin Dashboard
      </h2>
      <div style={{ color: C.muted, fontSize: 14, marginBottom: 28 }}>
        Overview of your ecommerce platform
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 36,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 14,
              padding: "20px",
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 26,
                fontWeight: 800,
                color: s.tc,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 14,
        }}
      >
        Recent Orders
      </h3>
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "#F8F7F4",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {["Order ID", "Date", "Items", "Total", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 18px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    letterSpacing: 0.8,
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => {
              const sm = statusMeta[o.status] || statusMeta["Processing"];
              return (
                <tr
                  key={o.id}
                  style={{
                    borderBottom:
                      i < orders.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {o.id}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: C.muted,
                      fontSize: 14,
                    }}
                  >
                    {o.date}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: C.muted,
                      fontSize: 14,
                    }}
                  >
                    {o.items.length} item{o.items.length > 1 ? "s" : ""}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {fmt(o.total)}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <Badge label={o.status} color={sm.c} bg={sm.bg} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin Products ───────────────────────────────────────────────────────────
// GET    /api/admin/products      — list all
// POST   /api/admin/products      — create product
// PUT    /api/admin/products/:id  — update product
// DELETE /api/admin/products/:id  — delete product
const EMOJIS = [
  "📦",
  "🎧",
  "⌚",
  "⌨️",
  "🧥",
  "👟",
  "☕",
  "🕯️",
  "📚",
  "🎮",
  "📱",
  "💻",
  "🖥️",
  "🎒",
  "🎁",
];

function AdminProducts({ products, onSave, onDelete }) {
  const blank = {
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    description: "",
    image: "📦",
  };
  const [modal, setModal] = useState(null); // null | { mode: "new"|"edit", data: {} }
  const [form, setForm] = useState(blank);
  const [confirmDel, setConfirmDel] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openNew = () => {
    setForm(blank);
    setModal({ mode: "new" });
  };
  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock) });
    setModal({ mode: "edit", id: p.id });
  };
  const save = () => {
    if (!form.name || !form.price) return;
    onSave({ ...form, price: +form.price, stock: +form.stock, id: modal.id });
    setModal(null);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Product Catalog
          </h2>
          <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>
            {products.length} total products · PUT /api/admin/products/:id to
            update
          </div>
        </div>
        <Btn
          onClick={openNew}
          variant="primary"
          style={{ fontSize: 15, padding: "10px 22px" }}
        >
          + New Product
        </Btn>
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "32px",
              width: 500,
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                marginBottom: 22,
              }}
            >
              {modal.mode === "new" ? "Create New Product" : "Edit Product"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input
                label="Product Name"
                placeholder="e.g. Wireless Headphones"
                value={form.name}
                onChange={set("name")}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="1999"
                  value={form.price}
                  onChange={set("price")}
                />
                <Input
                  label="Stock Qty"
                  type="number"
                  placeholder="20"
                  value={form.stock}
                  onChange={set("stock")}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.muted,
                    letterSpacing: 0.5,
                  }}
                >
                  CATEGORY
                </label>
                <select
                  value={form.category}
                  onChange={set("category")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    background: C.card,
                    outline: "none",
                  }}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.muted,
                    letterSpacing: 0.5,
                  }}
                >
                  ICON EMOJI
                </label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setForm((f) => ({ ...f, image: e }))}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        border: `2px solid ${form.image === e ? C.accent : C.border}`,
                        background: form.image === e ? C.accentLight : C.card,
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.muted,
                    letterSpacing: 0.5,
                  }}
                >
                  DESCRIPTION
                </label>
                <textarea
                  value={form.description}
                  rows={3}
                  onChange={set("description")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <Btn
                  onClick={save}
                  variant="primary"
                  style={{ flex: 1, padding: "12px", fontSize: 15 }}
                >
                  {modal.mode === "new" ? "Create Product" : "Save Changes"}
                </Btn>
                <Btn
                  onClick={() => setModal(null)}
                  variant="ghost"
                  style={{ flex: 1, padding: "12px", fontSize: 15 }}
                >
                  Cancel
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "32px",
              width: 380,
              textAlign: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 8,
              }}
            >
              Delete Product?
            </h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
              This will call DELETE /api/admin/products/{confirmDel.id}. This
              action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => {
                  onDelete(confirmDel.id);
                  setConfirmDel(null);
                }}
                style={{
                  flex: 1,
                  background: C.danger,
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: 9,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Delete
              </button>
              <Btn
                onClick={() => setConfirmDel(null)}
                variant="ghost"
                style={{ flex: 1, padding: "12px", fontSize: 15 }}
              >
                Cancel
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "#F8F7F4",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 18px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.muted,
                    letterSpacing: 0.8,
                  }}
                >
                  {h.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  borderBottom:
                    i < products.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <td style={{ padding: "14px 18px" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ fontSize: 24 }}>{p.image}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: C.muted,
                          maxWidth: 220,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <Badge
                    label={p.category}
                    color={C.accentText}
                    bg={C.accentLight}
                  />
                </td>
                <td
                  style={{
                    padding: "14px 18px",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {fmt(p.price)}
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color:
                        p.stock === 0
                          ? C.danger
                          : p.stock < 10
                            ? C.warn
                            : C.success,
                    }}
                  >
                    {p.stock}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => openEdit(p)} variant="info">
                      Edit
                    </Btn>
                    <Btn onClick={() => setConfirmDel(p)} variant="danger">
                      Delete
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ msg, type }) {
  const isErr = type === "error";
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 999,
        background: isErr ? C.dangerBg : C.successBg,
        color: isErr ? C.danger : C.success,
        border: `1px solid ${isErr ? "#FECACA" : "#A7F3D0"}`,
        padding: "10px 20px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      }}
    >
      <span>{isErr ? "✕" : "✓"}</span> {msg}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("catalog");
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // Cart operations — mirrors POST /api/cart & DELETE /api/cart/:id
  const addToCart = (p) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      return ex
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { ...p, qty: 1 }];
    });
    notify(`${p.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));

  // Checkout — mirrors POST /api/orders
  const checkout = () => {
    const order = {
      id: `ORD-${String(orders.length + 3).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      status: "Processing",
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    setView("orders");
    notify("Order placed successfully! 🎉");
  };

  // Admin — mirrors PUT /api/admin/products/:id & DELETE /api/admin/products/:id
  const saveProduct = (data) => {
    if (data.id && products.find((p) => p.id === data.id)) {
      setProducts((ps) =>
        ps.map((p) => (p.id === data.id ? { ...p, ...data } : p)),
      );
      notify("Product updated");
    } else {
      setProducts((ps) => [...ps, { ...data, id: Date.now() }]);
      notify("Product created");
    }
  };

  const deleteProduct = (id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    notify("Product deleted", "error");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!user)
    return (
      <AuthScreen
        onLogin={(u) => {
          setUser(u);
          setView(u.role === "admin" ? "dashboard" : "catalog");
        }}
      />
    );

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
      }}
    >
      {toast && <Toast {...toast} />}
      <Navbar
        user={user}
        view={view}
        setView={setView}
        cartCount={cartCount}
        onLogout={() => {
          setUser(null);
          setCart([]);
        }}
      />
      <div style={{ padding: "32px 28px", maxWidth: 1120, margin: "0 auto" }}>
        {/* Customer views */}
        {user.role === "customer" && view === "catalog" && (
          <CatalogView
            products={products}
            cart={cart}
            onAdd={addToCart}
            onQty={updateQty}
          />
        )}
        {user.role === "customer" && view === "cart" && (
          <CartView
            cart={cart}
            onQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={checkout}
          />
        )}
        {user.role === "customer" && view === "orders" && (
          <OrdersView orders={orders} />
        )}
        {/* Admin views */}
        {user.role === "admin" && view === "dashboard" && (
          <AdminDashboard products={products} orders={orders} />
        )}
        {user.role === "admin" && view === "products" && (
          <AdminProducts
            products={products}
            onSave={saveProduct}
            onDelete={deleteProduct}
          />
        )}
      </div>
    </div>
  );
}
