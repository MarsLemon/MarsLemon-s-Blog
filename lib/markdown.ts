import { marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

// Configure marked with modern features
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  }),
)

// Custom renderer for enhanced features
const renderer = new marked.Renderer()

// Enhanced link rendering with external link handling
renderer.link = (href, title, text) => {
  const isExternal = href?.startsWith("http") && !href.includes(window?.location?.hostname || "")
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ""
  const titleAttr = title ? ` title="${title}"` : ""
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`
}

// Enhanced image rendering with lazy loading
renderer.image = (href, title, text) => {
  const titleAttr = title ? ` title="${title}"` : ""
  const altAttr = text ? ` alt="${text}"` : ""
  return `<img src="${href}"${altAttr}${titleAttr} loading="lazy" class="rounded-lg shadow-sm" />`
}

// Enhanced table rendering
renderer.table = (header, body) => `<div class="overflow-x-auto my-6">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">${header}</thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">${body}</tbody>
    </table>
  </div>`

// Enhanced blockquote rendering
renderer.blockquote = (quote) =>
  `<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg italic">${quote}</blockquote>`

// Enhanced code block rendering
renderer.code = (code, language) => {
  const validLang = language && hljs.getLanguage(language) ? language : "plaintext"
  const highlighted = hljs.highlight(code, { language: validLang }).value

  return `<div class="relative my-6">
    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${validLang}</span>
      <button onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, "\\`")}\`)" 
              class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        Copy
      </button>
    </div>
    <pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code class="hljs language-${validLang}">${highlighted}</code></pre>
  </div>`
}

// Configure marked options
marked.setOptions({
  renderer,
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  pedantic: false,
  sanitize: false, // Allow HTML (be careful with user input)
  smartypants: true, // Use smart quotes and dashes
})

// Extensions for additional features
const extensions = [
  // Task list extension
  {
    name: "taskList",
    level: "block",
    start(src: string) {
      return src.match(/^\s*[-*+] \[[ x]\]/)?.index
    },
    tokenizer(src: string) {
      const rule = /^(\s*)([-*+]) \[([x ])\] (.+)$/gm
      const match = rule.exec(src)
      if (match) {
        return {
          type: "taskList",
          raw: match[0],
          checked: match[3] === "x",
          text: match[4],
        }
      }
    },
    renderer(token: any) {
      const checked = token.checked ? "checked" : ""
      return `<div class="flex items-center gap-2 my-1">
        <input type="checkbox" ${checked} disabled class="rounded" />
        <span class="${token.checked ? "line-through text-gray-500" : ""}">${token.text}</span>
      </div>`
    },
  },

  // Alert/Callout extension
  {
    name: "alert",
    level: "block",
    start(src: string) {
      return src.match(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)?.index
    },
    tokenizer(src: string) {
      const rule = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:> .*\n?)*)/m
      const match = rule.exec(src)
      if (match) {
        const type = match[1].toLowerCase()
        const content = match[2].replace(/^> /gm, "").trim()
        return {
          type: "alert",
          raw: match[0],
          alertType: type,
          text: content,
        }
      }
    },
    renderer(token: any) {
      const types = {
        note: {
          icon: "ℹ️",
          class: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
        },
        tip: {
          icon: "💡",
          class:
            "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
        },
        important: {
          icon: "❗",
          class:
            "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200",
        },
        warning: {
          icon: "⚠️",
          class:
            "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
        },
        caution: {
          icon: "🚨",
          class: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
        },
      }

      const config = types[token.alertType as keyof typeof types] || types.note

      return `<div class="border-l-4 p-4 my-4 rounded-r-lg ${config.class}">
        <div class="flex items-start gap-2">
          <span class="text-lg">${config.icon}</span>
          <div class="flex-1">
            <div class="font-semibold uppercase text-xs mb-1">${token.alertType}</div>
            <div>${marked.parse(token.text)}</div>
          </div>
        </div>
      </div>`
    },
  },
]

// Add extensions to marked
extensions.forEach((ext) => marked.use({ extensions: [ext] }))

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown)
}

export function extractExcerpt(content: string, length = 160): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
    .replace(/!\[(.*?)\]$$.*?$$/g, "$1") // Remove images
    .replace(/^>\s+/gm, "") // Remove blockquotes
    .replace(/^\s*[-*+]\s+/gm, "") // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, "") // Remove numbered list markers
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  return plainText.length > length ? plainText.substring(0, length) + "..." : plainText
}
