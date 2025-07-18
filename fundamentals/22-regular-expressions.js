// 22 - Regular Expressions (RegExp)
// Master pattern matching, validation, and text processing with regex

console.log("=== Regular Expressions ===");

// 1. Creating Regular Expressions
console.log("\n=== Creating RegExp ===");

// Method 1: Literal notation (preferred for static patterns)
const regex1 = /hello/;
const regex2 = /hello/i; // i flag for case-insensitive

// Method 2: Constructor (useful for dynamic patterns)
const regex3 = new RegExp("hello");
const regex4 = new RegExp("hello", "i");

// Dynamic pattern
const searchTerm = "world";
const dynamicRegex = new RegExp(searchTerm, "gi");

console.log("Literal regex:", regex1);
console.log("Constructor regex:", regex3);
console.log("Dynamic regex:", dynamicRegex);

// 2. Basic Pattern Matching
console.log("\n=== Basic Pattern Matching ===");

const text = "Hello World! This is a test.";

// test() - returns true/false
console.log("Contains 'Hello':", /Hello/.test(text));
console.log("Contains 'hello' (case-sensitive):", /hello/.test(text));
console.log("Contains 'hello' (case-insensitive):", /hello/i.test(text));

// exec() - returns match details or null
const match = /world/i.exec(text);
console.log("Match details:", match);
if (match) {
    console.log("Found:", match[0]);
    console.log("Index:", match.index);
    console.log("Input:", match.input);
}

// String methods with regex
console.log("Search for 'World':", text.search(/World/));
console.log("Match 'is':", text.match(/is/g));
console.log("Replace 'test':", text.replace(/test/, "example"));

// 3. Regex Flags
console.log("\n=== Regex Flags ===");

const sampleText = "JavaScript is GREAT! JavaScript is powerful.";

// g - global (find all matches)
console.log("Global matches:", sampleText.match(/JavaScript/g));
console.log("Single match:", sampleText.match(/JavaScript/));

// i - case insensitive
console.log("Case insensitive:", sampleText.match(/javascript/gi));

// m - multiline
const multilineText = `Line 1: Start here
Line 2: Middle content
Line 3: End here`;

console.log("Multiline ^ matches:", multilineText.match(/^Line/gm));
console.log("Multiline $ matches:", multilineText.match(/here$/gm));

// s - dotall (. matches newlines)
console.log("Dotall example:", /Start.*End/.test(multilineText)); // false
console.log("Dotall with s flag:", /Start.*End/s.test(multilineText)); // true

// 4. Character Classes and Special Characters
console.log("\n=== Character Classes ===");

const testStrings = [
    "hello123",
    "WORLD456",
    "Test@2023",
    "space here",
    "123-456-7890",
    "user@email.com"
];

// Basic character classes
const patterns = {
    digits: /\d+/g,           // One or more digits
    words: /\w+/g,            // One or more word characters
    whitespace: /\s+/g,       // One or more whitespace
    nonDigits: /\D+/g,        // One or more non-digits
    nonWords: /\W+/g,         // One or more non-word characters
    nonWhitespace: /\S+/g     // One or more non-whitespace
};

testStrings.forEach(str => {
    console.log(`\nTesting: "${str}"`);
    Object.entries(patterns).forEach(([name, pattern]) => {
        const matches = str.match(pattern);
        console.log(`  ${name}: ${matches ? matches.join(', ') : 'none'}`);
    });
});

// Custom character classes
const customText = "Price: $25.99, Discount: 15%, Code: ABC123";

console.log("\nCustom character classes:");
console.log("Letters only:", customText.match(/[a-zA-Z]+/g));
console.log("Numbers only:", customText.match(/[0-9]+/g));
console.log("Punctuation:", customText.match(/[^\w\s]/g));
console.log("Vowels:", customText.match(/[aeiouAEIOU]/g));
console.log("Not vowels:", customText.match(/[^aeiouAEIOU\s\d\W]/g));

// 5. Quantifiers
console.log("\n=== Quantifiers ===");

const quantifierText = "a aa aaa aaaa aaaaa";
const emailTest = "test@example.com, invalid@, @invalid.com, valid@test.co.uk";
const phoneTest = "123-456-7890, (555) 123-4567, +1-800-555-0123";

// Basic quantifiers
console.log("Quantifier examples:");
console.log("a{3} (exactly 3):", quantifierText.match(/a{3}/g));
console.log("a{2,4} (2 to 4):", quantifierText.match(/a{2,4}/g));
console.log("a{3,} (3 or more):", quantifierText.match(/a{3,}/g));

// Common quantifiers
console.log("a+ (one or more):", quantifierText.match(/a+/g));
console.log("a* (zero or more):", "bbbb".match(/a*/g));
console.log("a? (zero or one):", "ba".match(/ba?/g));

// Greedy vs lazy quantifiers
const greedyText = '<div>content</div><span>more</span>';
console.log("Greedy <.*>:", greedyText.match(/<.*>/g));
console.log("Lazy <.*?>:", greedyText.match(/<.*?>/g));

// 6. Anchors and Boundaries
console.log("\n=== Anchors and Boundaries ===");

const anchorTexts = [
    "start of line",
    "middle content end",
    "the word boundary test",
    "123abc456",
    "whole-word test-case"
];

anchorTexts.forEach(text => {
    console.log(`\nTesting: "${text}"`);
    console.log("  ^ start:", /^start/.test(text));
    console.log("  end $:", /end$/.test(text));
    console.log("  \\b word boundaries:", text.match(/\bword\b/g) || 'none');
    console.log("  \\B non-word boundaries:", text.match(/\Btest\B/g) || 'none');
});

// 7. Groups and Capturing
console.log("\n=== Groups and Capturing ===");

const dateText = "Today is 2023-12-25 and tomorrow is 2023-12-26";
const urlText = "Visit https://www.example.com or http://test.org";

// Capturing groups
const datePattern = /(\d{4})-(\d{2})-(\d{2})/g;
const dateMatches = [...dateText.matchAll(datePattern)];

console.log("Date matches with groups:");
dateMatches.forEach((match, index) => {
    console.log(`  Match ${index + 1}:`);
    console.log(`    Full: ${match[0]}`);
    console.log(`    Year: ${match[1]}`);
    console.log(`    Month: ${match[2]}`);
    console.log(`    Day: ${match[3]}`);
});

// Non-capturing groups
const urlPattern = /(?:https?:\/\/)?([\w.-]+)/g;
const urlMatches = [...urlText.matchAll(urlPattern)];

console.log("URL matches (non-capturing protocol):");
urlMatches.forEach((match, index) => {
    console.log(`  Domain ${index + 1}: ${match[1]}`);
});

// Named capturing groups
const emailPattern = /(?<username>[\w.]+)@(?<domain>[\w.-]+)/g;
const emailText = "Contact john.doe@example.com or admin@test.org";
const emailMatches = [...emailText.matchAll(emailPattern)];

console.log("Email matches with named groups:");
emailMatches.forEach((match, index) => {
    console.log(`  Email ${index + 1}:`);
    console.log(`    Username: ${match.groups.username}`);
    console.log(`    Domain: ${match.groups.domain}`);
});

// 8. Lookahead and Lookbehind
console.log("\n=== Lookahead and Lookbehind ===");

const passwordText = "password123, secret, mysecret123, 123password";

// Positive lookahead
const hasDigitAfter = /\w+(?=\d)/g;
console.log("Words followed by digits:", passwordText.match(hasDigitAfter));

// Negative lookahead
const noDigitAfter = /\w+(?!\d)/g;
console.log("Words not followed by digits:", passwordText.match(noDigitAfter));

// Positive lookbehind (if supported)
const priceText = "$10.99, €15.50, £8.25, 20.00";
try {
    const afterSymbol = /(?<=[$€£])\d+\.\d+/g;
    console.log("Prices after currency symbol:", priceText.match(afterSymbol));
} catch (error) {
    console.log("Lookbehind not supported in this environment");
}

// 9. Practical Validation Functions
console.log("\n=== Validation Functions ===");

class Validator {
    static email(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    static phone(phone) {
        // US phone number formats
        const pattern = /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        return pattern.test(phone);
    }
    
    static password(password) {
        // At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return pattern.test(password);
    }
    
    static url(url) {
        const pattern = /^https?:\/\/([\w.-]+)(:[0-9]+)?(\/.*)?$/;
        return pattern.test(url);
    }
    
    static creditCard(number) {
        // Basic credit card format (remove spaces/dashes first)
        const cleaned = number.replace(/[\s-]/g, '');
        const pattern = /^\d{13,19}$/;
        return pattern.test(cleaned);
    }
    
    static zipCode(zip) {
        // US ZIP code (12345 or 12345-6789)
        const pattern = /^\d{5}(-\d{4})?$/;
        return pattern.test(zip);
    }
}

// Test validation functions
const testData = [
    { type: 'email', valid: 'user@example.com', invalid: 'invalid-email' },
    { type: 'phone', valid: '(555) 123-4567', invalid: '123-456' },
    { type: 'password', valid: 'MyPass123!', invalid: 'weak' },
    { type: 'url', valid: 'https://example.com', invalid: 'not-a-url' },
    { type: 'creditCard', valid: '4532-1234-5678-9012', invalid: '123' },
    { type: 'zipCode', valid: '12345-6789', invalid: '1234' }
];

console.log("Validation tests:");
testData.forEach(({ type, valid, invalid }) => {
    const validResult = Validator[type](valid);
    const invalidResult = Validator[type](invalid);
    console.log(`${type}: ${valid} = ${validResult}, ${invalid} = ${invalidResult}`);
});

// 10. Text Processing Functions
console.log("\n=== Text Processing ===");

class TextProcessor {
    static extractEmails(text) {
        const pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        return text.match(pattern) || [];
    }
    
    static extractPhones(text) {
        const pattern = /(?:\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
        return text.match(pattern) || [];
    }
    
    static extractUrls(text) {
        const pattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
        return text.match(pattern) || [];
    }
    
    static highlightKeywords(text, keywords) {
        const pattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        return text.replace(pattern, '**$1**');
    }
    
    static removeHtmlTags(html) {
        return html.replace(/<[^>]*>/g, '');
    }
    
    static formatCurrency(text) {
        const pattern = /\$(\d+(?:\.\d{2})?)/g;
        return text.replace(pattern, 'USD $1');
    }
    
    static maskCreditCard(text) {
        const pattern = /\b(\d{4})[-\s]?(\d{4})[-\s]?(\d{4})[-\s]?(\d{4})\b/g;
        return text.replace(pattern, '**** **** **** $4');
    }
    
    static camelCase(text) {
        return text.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
    }
    
    static kebabCase(text) {
        return text.replace(/([a-z])([A-Z])/g, '$1-$2')
                  .replace(/[\s_]+/g, '-')
                  .toLowerCase();
    }
}

// Test text processing
const sampleText = `
Contact us at info@example.com or support@test.org
Call (555) 123-4567 or +1-800-555-0199
Visit https://example.com or http://test.org
Price: $29.99, Special offer: $19.95
Credit card: 4532-1234-5678-9012
HTML: <p>This is <strong>bold</strong> text</p>
`;

console.log("Text processing examples:");
console.log("Emails:", TextProcessor.extractEmails(sampleText));
console.log("Phones:", TextProcessor.extractPhones(sampleText));
console.log("URLs:", TextProcessor.extractUrls(sampleText));
console.log("Keywords highlighted:", TextProcessor.highlightKeywords(sampleText, ['contact', 'price', 'visit']));
console.log("HTML removed:", TextProcessor.removeHtmlTags('<p>This is <strong>bold</strong> text</p>'));
console.log("Currency formatted:", TextProcessor.formatCurrency('Price is $29.99'));
console.log("Credit card masked:", TextProcessor.maskCreditCard('Card: 4532-1234-5678-9012'));

// Case conversion examples
console.log("camelCase:", TextProcessor.camelCase('hello-world_test case'));
console.log("kebab-case:", TextProcessor.kebabCase('HelloWorldTestCase'));

// 11. Advanced Regex Techniques
console.log("\n=== Advanced Techniques ===");

// Recursive patterns (for balanced parentheses, etc.)
function findBalancedParentheses(text) {
    const stack = [];
    const matches = [];
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '(') {
            stack.push(i);
        } else if (text[i] === ')' && stack.length > 0) {
            const start = stack.pop();
            matches.push(text.substring(start, i + 1));
        }
    }
    
    return matches;
}

const parenthesesText = "Function(arg1, nested(inner), arg3)";
console.log("Balanced parentheses:", findBalancedParentheses(parenthesesText));

// Regex builder for complex patterns
class RegexBuilder {
    constructor() {
        this.pattern = '';
        this.flags = '';
    }
    
    literal(text) {
        this.pattern += text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this;
    }
    
    group(callback) {
        this.pattern += '(';
        callback();
        this.pattern += ')';
        return this;
    }
    
    oneOf(options) {
        this.pattern += '(' + options.map(opt => 
            opt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        ).join('|') + ')';
        return this;
    }
    
    optional() {
        this.pattern += '?';
        return this;
    }
    
    oneOrMore() {
        this.pattern += '+';
        return this;
    }
    
    zeroOrMore() {
        this.pattern += '*';
        return this;
    }
    
    global() {
        this.flags += 'g';
        return this;
    }
    
    caseInsensitive() {
        this.flags += 'i';
        return this;
    }
    
    build() {
        return new RegExp(this.pattern, this.flags);
    }
}

// Build a complex email regex
const emailRegex = new RegexBuilder()
    .literal('[A-Za-z0-9._%+-]+')
    .literal('@')
    .literal('[A-Za-z0-9.-]+')
    .literal('\\.')
    .literal('[A-Z|a-z]{2,}')
    .global()
    .caseInsensitive()
    .build();

console.log("Built email regex:", emailRegex);
console.log("Email matches:", "test@example.com, admin@test.org".match(emailRegex));

console.log("\n=== Regex Best Practices ===");
console.log("1. Use literal notation for static patterns");
console.log("2. Escape special characters when matching literally");
console.log("3. Use non-capturing groups (?:) when you don't need the match");
console.log("4. Be careful with greedy vs lazy quantifiers");
console.log("5. Test your regex thoroughly with edge cases");
console.log("6. Consider performance for complex patterns");
console.log("7. Use named groups for better readability");