
function isConsecutiveDay(date1, date2) {
    const oneDay = 86400000; 
    const prevDayUTC = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const currentDayUTC = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return (currentDayUTC - prevDayUTC) === oneDay;
}


function updateStreak() {
    let streak = 0;
    const sortedEntries = journals.sort((a, b) => new Date(a.date) - new Date(b.date));

    for (let i = 1; i < sortedEntries.length; i++) {
        const prevDay = new Date(sortedEntries[i - 1].date);
        const currentDay = new Date(sortedEntries[i].date);
        
        if (isConsecutiveDay(prevDay, currentDay)) {
            streak++; 
        } else {
            streak = 0; 
        }
    }
    
    document.querySelector('.streak-number').textContent = streak;
}
