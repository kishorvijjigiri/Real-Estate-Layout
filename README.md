# 🏡 Real Estate Plot Layout Web Application

A clean, responsive, and easy-to-understand web application built with **Next.js (App Router)**, **Tailwind CSS**, and **pure JavaScript (JSX)** that showcases a real estate plot layout.

---

## 📋 Features

- **Grid Structure Layout**: Displays plots in an intuitive, responsive grid structure (mobile to desktop).
- **Plot Status Colors**:
  - 🔘 **Available (Gray)**: Open for inquiry.
  - 🟢 **Booked (Green)**: Under agreement.
  - 🔴 **Sold (Disabled)**: Marked as sold and disabled from interaction.
- **Hover Information Tooltip**: Hovering on any plot displays plot number, size (Sq. Ft.), status, and total cost.
- **Plot Details Modal**: Clicking on a plot opens a clean popup with dimensions, facing, rate/sq.ft, and an inquiry button.
- **Filters**:
  - Filter by **Status** (All, Available, Booked, Sold)
  - Filter by **Plot Size** (≤ 1000, ≤ 1500, ≤ 2000, ≤ 3000 Sq.Ft.)
  - Filter by **Total Cost** (interactive slider from ₹20 Lakh to ₹1.80 Cr)
  - **Reset Button**: Quickly reset all filters back to default.
- **Color Legend**: Clear legend showing available, booked, and sold counts.

---

## 📁 File Structure

```
real-estate-plot-layout/
├── public/
│   └── layout-map.jpg           # Master layout aerial preview image
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind CSS styles
│   │   ├── layout.jsx           # Root layout with metadata
│   │   └── page.jsx             # Main page with state & filter logic
│   ├── components/
│   │   ├── Navbar.jsx           # Simple header component
│   │   ├── Legend.jsx           # Status color legend with counts
│   │   ├── FilterSection.jsx    # Filters for status, size, and cost slider
│   │   ├── PlotGrid.jsx         # Responsive grid container for plots
│   │   ├── PlotCard.jsx         # Individual plot card with hover tooltip
│   │   └── PlotModal.jsx        # Simple modal showing plot details
│   ├── data/
│   │   └── plotsData.js         # Dummy static data array of plots
│   └── utils/
│       └── formatters.js        # Currency formatter helper function
├── jsconfig.json                # Path alias (@/*) configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies & scripts
└── README.md                    # Project documentation
```

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have **Node.js** installed on your system.

### Steps:

1. **Open terminal** in the project directory:
   ```bash
   cd e:\Real-estate-plot-layout
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛠️ Tech Stack

- **Next.js** (App Router, JavaScript)
- **Tailwind CSS**
