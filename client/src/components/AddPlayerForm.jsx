import { useState } from "react";

const API = "";

const INITIAL_FORM = {
  full_name: "",
  position: "",
  club_name: "",
  country: "",
  birth_date: "",
  height_cm: "",
  weight_kg: "",
  preferred_foot: "",
  market_value_eur: "",
};

export default function AddPlayerForm({ onPlayerAdded }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        club_name: formData.club_name || null,
        country: formData.country || null,
        birth_date: formData.birth_date || null,
        height_cm: formData.height_cm ? Number(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : null,
        preferred_foot: formData.preferred_foot || null,
        market_value_eur: formData.market_value_eur ? Number(formData.market_value_eur) : null,
      };

      const res = await fetch(`${API}/api/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add player");
      }

      const result = await res.json();
      setFormData(INITIAL_FORM);
      onPlayerAdded?.(result.player_id);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box" };
  const labelStyle = { display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 };

  return (
    <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Player Information</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>
            Full Name <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="e.g., Cristiano Ronaldo"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>
            Position <span style={{ color: "#ff6b6b" }}>*</span>
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            style={{ ...inputStyle, padding: 10 }}
          >
            <option value="">-- Select position --</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Club</label>
          <input
            type="text"
            name="club_name"
            value={formData.club_name}
            onChange={handleChange}
            placeholder="e.g., Manchester United"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="e.g., Portugal" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Birth Date</label>
            <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Height (cm)</label>
            <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} placeholder="187" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Weight (kg)</label>
            <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} placeholder="83" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Preferred Foot</label>
            <select name="preferred_foot" value={formData.preferred_foot} onChange={handleChange} style={{ ...inputStyle, padding: 10 }}>
              <option value="">-- Select --</option>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Market Value (€)</label>
            <input type="number" name="market_value_eur" value={formData.market_value_eur} onChange={handleChange} placeholder="50000000" style={inputStyle} />
          </div>
        </div>

        {error && (
          <div style={{ padding: 12, backgroundColor: "#3d1f1f", border: "1px solid #ff6b6b", borderRadius: 8, fontSize: 14, color: "#ff6b6b" }}>
            ⚠️ {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{ 
            marginTop: 8, 
            padding: 14, 
            fontSize: 16, 
            fontWeight: 600,
            background: isSubmitting ? "#0f0f0f" : "#2a7de1",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "Adding..." : "Add Player"}
        </button>
      </form>
    </div>
  );
}
