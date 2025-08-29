/**
 * Seasonal Background System
 * Determines the current season based on date and returns appropriate background image
 */

/**
 * Get the current season based on the current date
 * @param {Date} date - Optional date to check (defaults to current date)
 * @returns {string} - Season name: 'spring', 'summer', 'fall', 'winter'
 */
export const getCurrentSeason = (date = new Date()) => {
  const month = date.getMonth() + 1 // getMonth() returns 0-11, we want 1-12
  const day = date.getDate()
  
  // Define season boundaries (Northern Hemisphere)
  // Spring: March 20 - June 20
  // Summer: June 21 - September 22
  // Fall: September 23 - December 20
  // Winter: December 21 - March 19
  
  if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20)) {
    return 'spring'
  } else if ((month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 22)) {
    return 'summer'
  } else if ((month === 9 && day >= 23) || (month > 9 && month < 12) || (month === 12 && day <= 20)) {
    return 'fall'
  } else {
    return 'winter'
  }
}

/**
 * Get the background image path for the current season
 * @param {Date} date - Optional date to check (defaults to current date)
 * @returns {string} - Background image path
 */
export const getSeasonalBackground = (date = new Date()) => {
  const season = getCurrentSeason(date)
  
  const backgroundMap = {
    spring: '/summer_bg_lrg.png', // Use summer background for spring (closest available)
    summer: '/summer_bg_lrg.png',
    fall: '/fall_bg_lrg.png',
    winter: '/winter_bg_lrg.png'
  }
  
  return backgroundMap[season] || '/summer_bg_lrg.png' // Default fallback
}

/**
 * Get seasonal theme colors and styling hints
 * @param {Date} date - Optional date to check (defaults to current date)
 * @returns {object} - Theme object with colors and styling hints
 */
export const getSeasonalTheme = (date = new Date()) => {
  const season = getCurrentSeason(date)
  
  const themeMap = {
    spring: {
      season: 'spring',
      primaryAccent: '#99E39E', // Use our primary green
      secondaryAccent: '#ffd700', // Warm yellow
      mood: 'fresh'
    },
    summer: {
      season: 'summer',
      primaryAccent: '#99E39E',
      secondaryAccent: '#ffd700',
      mood: 'bright'
    },
    fall: {
      season: 'fall',
      primaryAccent: '#F3DA94', // Warm gold
      secondaryAccent: '#ffd700',
      mood: 'warm'
    },
    winter: {
      season: 'winter',
      primaryAccent: '#99E39E',
      secondaryAccent: '#FCF4E2', // Off-white
      mood: 'cozy'
    }
  }
  
  return themeMap[season] || themeMap.summer
}

/**
 * Get seasonal CSS custom properties
 * @param {Date} date - Optional date to check (defaults to current date)
 * @returns {object} - CSS custom properties object
 */
export const getSeasonalCSSProperties = (date = new Date()) => {
  const backgroundImage = getSeasonalBackground(date)
  const theme = getSeasonalTheme(date)
  
  return {
    '--seasonal-background-image': `url('${backgroundImage}')`,
    '--seasonal-primary-accent': theme.primaryAccent,
    '--seasonal-secondary-accent': theme.secondaryAccent,
    '--seasonal-mood': theme.mood
  }
}