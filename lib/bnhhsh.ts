import pinyin from 'pinyin'
import 色情词库 from './data/色情词库.json'
import 色情词库_数据增强 from './data/色情词库_数据增强.json'
import 莉沫词库 from './data/莉沫词库.json'
import 常用汉字 from './data/常用汉字.json'
import 现代汉语常用词表 from './data/现代汉语常用词表.json'
import fs from 'fs'
import path from 'path'

const pt = path.resolve(__dirname, 'bnhhsh.json')

const setdefault = (dic, k, v) => {
  if (dic[k] === undefined) dic[k] = v
  return dic[k]
}

const max = 词桶 => {
  let $max = -1
  for (const i in 词桶) {
    $max = Math.max($max, parseInt(i))
  }
  return $max
}

const 破处 = () => {
  const 缩 = s =>
    pinyin(s, { style: pinyin.STYLE_FIRST_LETTER })
      .map(x => x[0].toLowerCase())
      .join('')

  const 丢 = (词桶, 词表, 痛苦) => {
    for (const i of 词表) {
      const k = 缩(i)
      const w = setdefault(词桶, i.length, {})
      const y = w[k]
      if (y) {
        if (y[1] > 痛苦) w[k] = [`${i}`, 痛苦]
      } else w[k] = [`${i}`, 痛苦]
    }
  }

  const 词桶 = {
    1: { i: ['爱', 0.1], u: ['幼', 0.1] }
  }

  丢(词桶, 色情词库, 0.001)
  丢(词桶, 莉沫词库, 0.01)
  丢(词桶, 色情词库_数据增强, 0.1)
  丢(词桶, 常用汉字, 0.11)
  丢(词桶, 现代汉语常用词表, 0.2)

  const n = max(词桶)
  for (let i = 1; i <= n; i++) setdefault(词桶, i, {})

  fs.writeFileSync(pt, JSON.stringify(词桶))
}

if (!fs.existsSync(pt)) 破处()
const 词桶 = JSON.parse(fs.readFileSync(pt, { encoding: 'utf-8' }))
const n = max(词桶)

const yndp = (target: string | string[]) => {
  const 代价 = { '-1': 0 }
  const 记录 = { '-1': [] }
  for (let x = 0; x < target.length; x++) {
    代价[x] = Math.pow(2, 32)
    for (let k = n; k > 0; k--) {
      const s = x - k + 1
      if (s < 0) continue
      const c = 词桶[k][target.slice(s, x + 1) as string]
      if (c) {
        const [词, 痛苦] = c
        if (代价[x - k] + 痛苦 < 代价[x]) {
          代价[x] = 代价[x - k] + 痛苦
          记录[x] = [...记录[x - k]]
          记录[x].push([s, x + 1, 词])
        }
      }
    }
    if (代价[x - 1] + 1 < 代价[x]) {
      代价[x] = 代价[x - 1] + 1
      记录[x] = [...记录[x - 1]]
    }
  }
  target = (target as string).split('')
  for (const [a, b, c] of 记录[target.length - 1].reverse()) {
    target.splice(a, b - a, ...c)
  }

  return [target.join(''), 代价[target.length - 1]]
}

const dp = (target: string) => yndp(target)[0]

export default dp
