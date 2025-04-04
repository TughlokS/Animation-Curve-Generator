# CanvasBox Icon Regrouping Plan


## Current Structure
Currently, the CanvasBox component has the following layout:
1. The input values and settings icon are grouped together in a .curve-value-box container
2. The grid icon is separate and positioned after the curve value box
3. This creates a visual disconnect between related UI controls (grid and settings)

## Proposed Changes

### 1. Component Structure Changes
- Move the grid icon button out of its current position
- Create a new container div to group the grid icon and settings icon together
- Position this new container after the curve value box

### 2. SCSS Styling Changes
- Create a new class .icon-group-box in the canvasBox.scss file
- Style this container similar to the curve-value-box but optimized for icons
- Ensure proper spacing, alignment, and responsive behavior

### 3. Detailed Implementation Steps

#### JSX Changes (CanvasBox.jsx)
1. Remove the settings button from the curve-value-box
2. Create a new container div with class icon-group-box
3. Place both the settings button and grid button inside this container
4. Keep all existing button functionality and props

#### SCSS Changes (canvasBox.scss)
1. Create a new .icon-group-box class with the following properties:
   - Flexbox display with center alignment
   - Appropriate gap between icons
   - Matching border-radius and styling to maintain visual consistency
   - Responsive sizing using clamp() for different screen sizes
2. Adjust the existing .curve-value-box styles as needed
3. Ensure proper spacing between the curve value box and the new icon group

### 4. Responsive Considerations
- Maintain proper spacing on all screen sizes
- Ensure touch targets remain accessible on mobile devices
- Adjust gap and padding values using clamp() for smooth scaling

### 5. Testing Requirements
- Test on multiple screen sizes from desktop to mobile
- Verify that the grouped icons maintain proper spacing and alignment
- Ensure all hover/active states and tooltips continue to function correctly

This plan ensures that only SCSS files will be modified (not CSS files) and maintains the responsive design principles established in the project.
