# AI Risk Database Application Architecture

## Overview

The application will visualize AI risk data with interactive dashboards and filters. It will consist of a React frontend for visualizations and a Node.js/Express backend to serve the data.

## Data Structure

The database contains records with the following fields:

- Title: Risk title
- QuickRef: Quick reference code
- Ev_ID: Evidence ID
- Paper_ID: Paper reference ID
- Cat_ID: Category ID
- SubCat_ID: Subcategory ID
- AddEv_ID: Additional evidence ID
- Category level: Hierarchical level
- Risk category: Main risk category
- Risk subcategory: Specific subcategory
- Description: Risk description
- Additional ev.: Additional evidence
- P.Def: Primary definition
- p.AddEv: primary additional evidence
- Entity: Entity associated with risk
- Intent: Intentional or unintentional
- Timing: Pre-deployment, deployment, or post-deployment
- Domain: Risk domain
- Sub-domain: Risk subdomain

## Components

### Backend (Node.js/Express)

1. **API Routes**:

   - GET /api/risks - Get all risks with pagination
   - GET /api/risks/stats - Get aggregated statistics
   - GET /api/risks/domains - Get domain breakdown
   - GET /api/risks/subdomains - Get subdomain breakdown
   - GET /api/risks/causal - Get causal factors breakdown

2. **Data Processing**:
   - CSV parsing and data loading
   - Data aggregation for visualizations
   - Filtering based on query parameters

### Frontend (React)

1. **Dashboard**:

   - Main layout with filter panel
   - Domain frequency visualization
   - Causal factor breakdown
   - Risk details table

2. **Visualizations**:

   - Bar chart for domain frequency
   - Heatmap for domain × causal factors
   - Donut chart for causal breakdown
   - Time trend analysis

3. **Filter Controls**:

   - Domain/subdomain selection
   - Entity type filtering
   - Intent filtering
   - Timing selection

4. **Detail View**:
   - Risk details panel
   - Expanded information on selection

## Technologies

- Frontend: React, React Router, Recharts/D3.js
- Backend: Node.js, Express
- Data: CSV parsing with csv-parser
- Styling: CSS/SCSS with responsive design
