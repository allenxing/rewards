## Design System: 家庭成长激励助手

### Pattern
- **Name:** Social Proof-Focused + Trust
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Claymorphism (Mobile)
- **Mode Support:** Light ✓ Light | Dark ⚠ Dark (adjusted)
- **Keywords:** claymorphism, clay, 3d, soft, bubbly, candy, playful, rounded, squish, tactile, inflate, silicone, haptic, spring
- **Best For:** Children education apps, teen social products, crypto gamification, creative tools, brand mascot-led apps
- **Performance:** ⚠ Moderate–Heavy (shadows+blur) | **Accessibility:** ✓ WCAG AA (careful)

### Colors
| Role | Hex | CSS Variable | Tamagui Token |
|------|-----|--------------|---------------|
| Primary | `#2563EB` | `--color-primary` | `$primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` | `$color` |
| Secondary | `#059669` | `--color-secondary` | `$secondary` |
| Accent/CTA | `#D97706` | `--color-accent` | `$accent` |
| Background | `#F8FAFC` | `--color-background` | `$background` |
| Foreground | `#0F172A` | `--color-foreground` | `$color` |
| Muted | `#F1F5FD` | `--color-muted` | `$backgroundHover` |
| Border | `#E4ECFC` | `--color-border` | `$borderColor` |
| Destructive | `#DC2626` | `--color-destructive` | `$danger` |
| Success | `#10B981` | `--color-success` | `$success` |
| Warning | `#F59E0B` | `--color-warning` | `$warning` |
| Ring | `#2563EB` | `--color-ring` | `$primary` |

*Notes: Family blue + chore green - warm and friendly color palette for family use*

### Typography
- **Heading:** Baloo 2 (rounded, playful, perfect for kids)
- **Body:** Comic Neue (friendly, easy to read for both children and adults)
- **Mood:** kids, education, playful, friendly, colorful, learning
- **Best For:** Children's apps, educational games, kid-friendly content
- **Font Weights:**
  - Heading: 400 (regular), 600 (semibold), 700 (bold)
  - Body: 400 (regular), 700 (bold)

### Key Effects & Interaction Rules
1. **Shadows:** Multi-layer soft shadows to simulate clay depth
   - Buttons: 2-layer shadow (offset 0 4px, opacity 0.2 + offset 0 8px, opacity 0.1)
   - Cards: 3-layer soft shadow for clay effect

2. **Border Radius:**
   - Screen containers: 40-50px top/bottom radius
   - Cards: 32px radius
   - Buttons: 20-24px radius
   - Inputs: 16px radius

3. **Animations:**
   - Press effect: Spring squish animation (scale 0.92 → 1.0 on press/release)
   - Transitions: 150-300ms duration with spring easing
   - Floating elements: Slow ±20px drift animation for decorative elements

4. **Haptics:**
   - Light haptic feedback on all button presses
   - Medium haptic for successful actions (reward, task completion)
   - Heavy haptic for errors or destructive actions

5. **Touch Targets:**
   - Minimum 44x44pt for all interactive elements
   - 8px minimum spacing between touch targets

### Avoid (Anti-patterns)
- Muted, dull colors - keep the interface vibrant and energetic
- Sharp corners - all elements should have rounded edges
- Low contrast - ensure text and icons are easily readable
- Complex animations that might distract children from core content
