// 24 - Date and Time Handling
// Master JavaScript Date object, formatting, calculations, and time zones

console.log("=== Date and Time Handling ===");

// 1. Creating Dates
console.log("\n=== Creating Dates ===");

// Current date and time
const now = new Date();
console.log("Current date:", now);
console.log("Current timestamp:", now.getTime());

// Creating dates from strings
const dateFromString = new Date("2024-01-15");
const timeFromString = new Date("2024-01-15T10:30:00");
const fullDate = new Date("January 15, 2024 10:30:00");

console.log("Date from string:", dateFromString);
console.log("Time from string:", timeFromString);
console.log("Full date string:", fullDate);

// Creating dates from numbers (year, month, day, hour, minute, second, millisecond)
// Note: month is 0-indexed (0 = January, 11 = December)
const specificDate = new Date(2024, 0, 15, 10, 30, 0, 0);
console.log("Specific date:", specificDate);

// Creating date from timestamp
const timestampDate = new Date(1705312200000);
console.log("From timestamp:", timestampDate);

// Creating date from Date.UTC()
const utcDate = new Date(Date.UTC(2024, 0, 15, 10, 30, 0));
console.log("UTC date:", utcDate);

// 2. Date Components and Methods
console.log("\n=== Date Components ===");

const sampleDate = new Date("2024-03-15T14:30:45.123");

// Getting components
console.log("Date components for:", sampleDate);
console.log("Year:", sampleDate.getFullYear());
console.log("Month (0-11):", sampleDate.getMonth());
console.log("Month name:", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][sampleDate.getMonth()]);
console.log("Date (1-31):", sampleDate.getDate());
console.log("Day of week (0-6):", sampleDate.getDay());
console.log("Day name:", ["Sunday", "Monday", "Tuesday", "Wednesday", 
                        "Thursday", "Friday", "Saturday"][sampleDate.getDay()]);
console.log("Hours (0-23):", sampleDate.getHours());
console.log("Minutes (0-59):", sampleDate.getMinutes());
console.log("Seconds (0-59):", sampleDate.getSeconds());
console.log("Milliseconds (0-999):", sampleDate.getMilliseconds());

// UTC equivalents
console.log("\nUTC components:");
console.log("UTC Year:", sampleDate.getUTCFullYear());
console.log("UTC Month:", sampleDate.getUTCMonth());
console.log("UTC Date:", sampleDate.getUTCDate());
console.log("UTC Hours:", sampleDate.getUTCHours());

// Timezone offset
console.log("Timezone offset (minutes):", sampleDate.getTimezoneOffset());

// 3. Setting Date Components
console.log("\n=== Setting Date Components ===");

const modifiableDate = new Date("2024-01-01T00:00:00");
console.log("Original date:", modifiableDate);

// Setting individual components
modifiableDate.setFullYear(2025);
modifiableDate.setMonth(5); // June (0-indexed)
modifiableDate.setDate(15);
modifiableDate.setHours(14);
modifiableDate.setMinutes(30);
modifiableDate.setSeconds(45);

console.log("Modified date:", modifiableDate);

// Setting multiple components at once
const multiSet = new Date();
multiSet.setFullYear(2024, 11, 25); // December 25, 2024
console.log("Christmas 2024:", multiSet);

// 4. Date Formatting
console.log("\n=== Date Formatting ===");

const formatDate = new Date("2024-03-15T14:30:45");

// Built-in formatting methods
console.log("toString():", formatDate.toString());
console.log("toDateString():", formatDate.toDateString());
console.log("toTimeString():", formatDate.toTimeString());
console.log("toISOString():", formatDate.toISOString());
console.log("toJSON():", formatDate.toJSON());
console.log("toLocaleDateString():", formatDate.toLocaleDateString());
console.log("toLocaleTimeString():", formatDate.toLocaleTimeString());
console.log("toLocaleString():", formatDate.toLocaleString());

// Locale-specific formatting
console.log("\nLocale-specific formatting:");
console.log("US format:", formatDate.toLocaleDateString('en-US'));
console.log("UK format:", formatDate.toLocaleDateString('en-GB'));
console.log("German format:", formatDate.toLocaleDateString('de-DE'));
console.log("Japanese format:", formatDate.toLocaleDateString('ja-JP'));

// Custom formatting with options
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
};

console.log("Custom format:", formatDate.toLocaleString('en-US', options));

// 5. Date Calculations
console.log("\n=== Date Calculations ===");

const baseDate = new Date("2024-01-15T10:00:00");

// Adding/subtracting time
const oneHourLater = new Date(baseDate.getTime() + 60 * 60 * 1000);
const oneDayEarlier = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
const oneWeekLater = new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);

console.log("Base date:", baseDate);
console.log("One hour later:", oneHourLater);
console.log("One day earlier:", oneDayEarlier);
console.log("One week later:", oneWeekLater);

// Date difference
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-15");
const diffInMs = date2.getTime() - date1.getTime();
const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

console.log("Difference between dates:", diffInDays, "days");

// Age calculation
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

const birthDate = new Date("1990-05-15");
console.log("Age:", calculateAge(birthDate), "years");

// 6. Date Utility Functions
console.log("\n=== Date Utilities ===");

class DateUtils {
    // Check if year is leap year
    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }
    
    // Get days in month
    static getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }
    
    // Get first day of month
    static getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }
    
    // Get last day of month
    static getLastDayOfMonth(year, month) {
        return new Date(year, month + 1, 0);
    }
    
    // Add days to date
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
    // Add months to date
    static addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    
    // Add years to date
    static addYears(date, years) {
        const result = new Date(date);
        result.setFullYear(result.getFullYear() + years);
        return result;
    }
    
    // Format date as YYYY-MM-DD
    static formatAsISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Get week number
    static getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    // Get quarter
    static getQuarter(date) {
        return Math.floor((date.getMonth() + 3) / 3);
    }
    
    // Check if dates are same day
    static isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }
    
    // Get business days between dates
    static getBusinessDays(startDate, endDate) {
        let count = 0;
        let current = new Date(startDate);
        
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        
        return count;
    }
}

// Test utility functions
const testDate = new Date("2024-02-15");

console.log("Is 2024 leap year:", DateUtils.isLeapYear(2024));
console.log("Days in February 2024:", DateUtils.getDaysInMonth(2024, 1));
console.log("First day of February 2024:", DateUtils.getFirstDayOfMonth(2024, 1));
console.log("Last day of February 2024:", DateUtils.getLastDayOfMonth(2024, 1));
console.log("Add 10 days:", DateUtils.addDays(testDate, 10));
console.log("Add 3 months:", DateUtils.addMonths(testDate, 3));
console.log("ISO format:", DateUtils.formatAsISO(testDate));
console.log("Week number:", DateUtils.getWeekNumber(testDate));
console.log("Quarter:", DateUtils.getQuarter(testDate));

const businessDays = DateUtils.getBusinessDays(
    new Date("2024-01-01"),
    new Date("2024-01-31")
);
console.log("Business days in January 2024:", businessDays);

// 7. Working with Timezones
console.log("\n=== Timezone Handling ===");

// Current timezone offset
const currentOffset = new Date().getTimezoneOffset();
console.log("Current timezone offset (minutes):", currentOffset);
console.log("Current timezone offset (hours):", currentOffset / 60);

// Convert to different timezone (simulation)
function convertToTimezone(date, offsetHours) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + (offsetHours * 3600000));
}

const localTime = new Date();
const utcTime = convertToTimezone(localTime, 0);
const tokyoTime = convertToTimezone(localTime, 9);
const newYorkTime = convertToTimezone(localTime, -5);

console.log("Local time:", localTime);
console.log("UTC time:", utcTime);
console.log("Tokyo time (UTC+9):", tokyoTime);
console.log("New York time (UTC-5):", newYorkTime);

// 8. Date Validation
console.log("\n=== Date Validation ===");

class DateValidator {
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
    
    static isValidDateString(dateString) {
        const date = new Date(dateString);
        return this.isValidDate(date);
    }
    
    static isInPast(date) {
        return this.isValidDate(date) && date < new Date();
    }
    
    static isInFuture(date) {
        return this.isValidDate(date) && date > new Date();
    }
    
    static isWeekend(date) {
        if (!this.isValidDate(date)) return false;
        const day = date.getDay();
        return day === 0 || day === 6;
    }
    
    static isBusinessDay(date) {
        return this.isValidDate(date) && !this.isWeekend(date);
    }
    
    static isWithinRange(date, startDate, endDate) {
        return this.isValidDate(date) && 
               this.isValidDate(startDate) && 
               this.isValidDate(endDate) &&
               date >= startDate && date <= endDate;
    }
}

// Test validation
const validDate = new Date("2024-01-15");
const invalidDate = new Date("invalid");
const pastDate = new Date("2020-01-01");
const futureDate = new Date("2030-01-01");

console.log("Valid date:", DateValidator.isValidDate(validDate));
console.log("Invalid date:", DateValidator.isValidDate(invalidDate));
console.log("Valid date string:", DateValidator.isValidDateString("2024-01-15"));
console.log("Invalid date string:", DateValidator.isValidDateString("not-a-date"));
console.log("Is in past:", DateValidator.isInPast(pastDate));
console.log("Is in future:", DateValidator.isInFuture(futureDate));
console.log("Is weekend:", DateValidator.isWeekend(new Date("2024-01-14"))); // Sunday
console.log("Is business day:", DateValidator.isBusinessDay(new Date("2024-01-15"))); // Monday

// 9. Date Parsing and Formatting Library
console.log("\n=== Custom Date Formatter ===");

class DateFormatter {
    static format(date, pattern) {
        if (!DateValidator.isValidDate(date)) {
            throw new Error("Invalid date");
        }
        
        const tokens = {
            'YYYY': date.getFullYear(),
            'YY': String(date.getFullYear()).slice(-2),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'M': date.getMonth() + 1,
            'MMM': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()],
            'MMMM': ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()],
            'DD': String(date.getDate()).padStart(2, '0'),
            'D': date.getDate(),
            'dddd': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()],
            'ddd': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            'HH': String(date.getHours()).padStart(2, '0'),
            'H': date.getHours(),
            'hh': String(date.getHours() > 12 ? date.getHours() - 12 : date.getHours()).padStart(2, '0'),
            'h': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'm': date.getMinutes(),
            'ss': String(date.getSeconds()).padStart(2, '0'),
            's': date.getSeconds(),
            'A': date.getHours() >= 12 ? 'PM' : 'AM',
            'a': date.getHours() >= 12 ? 'pm' : 'am'
        };
        
        let formatted = pattern;
        for (const [token, value] of Object.entries(tokens)) {
            formatted = formatted.replace(new RegExp(token, 'g'), value);
        }
        
        return formatted;
    }
    
    static parse(dateString, pattern) {
        // Simple parser for basic patterns
        if (pattern === 'YYYY-MM-DD') {
            const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (match) {
                return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
            }
        }
        
        if (pattern === 'MM/DD/YYYY') {
            const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
                return new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
            }
        }
        
        throw new Error(`Cannot parse "${dateString}" with pattern "${pattern}"`);
    }
}

// Test custom formatter
const formatTestDate = new Date("2024-03-15T14:30:45");

console.log("Custom formatting examples:");
console.log("YYYY-MM-DD:", DateFormatter.format(formatTestDate, 'YYYY-MM-DD'));
console.log("MM/DD/YYYY:", DateFormatter.format(formatTestDate, 'MM/DD/YYYY'));
console.log("dddd, MMMM D, YYYY:", DateFormatter.format(formatTestDate, 'dddd, MMMM D, YYYY'));
console.log("h:mm A:", DateFormatter.format(formatTestDate, 'h:mm A'));
console.log("HH:mm:ss:", DateFormatter.format(formatTestDate, 'HH:mm:ss'));

// Test parsing
try {
    const parsed1 = DateFormatter.parse('2024-03-15', 'YYYY-MM-DD');
    const parsed2 = DateFormatter.parse('03/15/2024', 'MM/DD/YYYY');
    console.log("Parsed date 1:", parsed1);
    console.log("Parsed date 2:", parsed2);
} catch (error) {
    console.log("Parse error:", error.message);
}

// 10. Performance Considerations
console.log("\n=== Performance Tips ===");

// Reuse Date objects when possible
const performanceTest = () => {
    const start = Date.now();
    
    // Instead of creating new Date objects repeatedly
    const baseDate = new Date();
    for (let i = 0; i < 1000; i++) {
        const newDate = new Date(baseDate.getTime() + i * 1000);
        // Do something with newDate
    }
    
    const end = Date.now();
    console.log("Performance test completed in:", end - start, "ms");
};

performanceTest();

// Use timestamps for comparisons
const timestamp1 = Date.now();
const timestamp2 = new Date().getTime();
console.log("Timestamps are faster for comparisons:", timestamp1 > timestamp2);

console.log("\n=== Date Handling Best Practices ===");
console.log("1. Always validate dates before processing");
console.log("2. Be aware of timezone differences");
console.log("3. Use ISO strings for data storage");
console.log("4. Consider using libraries like moment.js or date-fns for complex operations");
console.log("5. Remember that months are 0-indexed in JavaScript");
console.log("6. Use timestamps for date arithmetic when possible");
console.log("7. Handle invalid dates gracefully");
console.log("8. Be consistent with date formats across your application");