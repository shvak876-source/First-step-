export const A11Y_KEY = "a11y-prefs";

/** רץ לפני הציור הראשון כדי למנוע הבהוב של הגדרות הנגישות. */
export const a11yBootScript = `try{var p=JSON.parse(localStorage.getItem("${A11Y_KEY}")||"{}");var c=document.documentElement.classList;if(p.text===1)c.add("a11y-text-lg");if(p.text===2)c.add("a11y-text-xl");if(p.contrast)c.add("a11y-contrast");if(p.links)c.add("a11y-links");if(p.readable)c.add("a11y-readable");if(p.noMotion)c.add("a11y-no-motion");}catch(e){}`;
