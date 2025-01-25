import Shiki from '@shikijs/markdown-it'
import MarkdownIt from 'markdown-it'

const md = MarkdownIt()

// 配置 markdown-It + shiki

md.use(await Shiki({
    themes: {
        light: 'github-dark',
        dark: 'github-dark',
    }
}))

export {
    md
}
