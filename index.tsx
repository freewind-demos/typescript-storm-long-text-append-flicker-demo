import {Box, ScrollView, Text, render, useApp, useInput} from "@orchetron/storm"
import {type FC, memo, useEffect, useMemo, useState} from "react"

// 每行重复的基础句子
const baseSentence =
  "Storm 用 cell 级 diff。观察长文本每秒只多一个字时，静态前缀会不会跟着闪。"

// 静态前缀行数
const staticPrefixLineCount = 120

// 会变区块行数
const growingLineCount = 120

// 每秒追加字符
const growChar = "字"

// 定时器间隔（毫秒）
const tickIntervalMs = 1000

// 生成静态前缀单行
const buildStaticLineText = (lineIndex: number): string => {
  return `[static ${String(lineIndex + 1).padStart(3, "0")}] ${baseSentence}`
}

// 生成会变区块单行
const buildGrowingLineText = (lineIndex: number): string => {
  return `[grow ${String(lineIndex + 1).padStart(3, "0")}] ${baseSentence}`
}

// 生成行数组
const buildLines = (
  lineCount: number,
  buildLine: (lineIndex: number) => string,
): string[] => {
  return Array.from({length: lineCount}, (_, lineIndex) => buildLine(lineIndex))
}

// 单行 Text
const BodyLine: FC<{line: string}> = memo(({line}) => {
  return <Text>{line}</Text>
})

// 静态前缀：无 state
const StaticPrefixBlock: FC = memo(() => {
  const lines = useMemo(
    () => buildLines(staticPrefixLineCount, buildStaticLineText),
    [],
  )

  return (
    <Box flexDirection="column">
      <Text dimColor>── 静态前缀（不应 re-render）──</Text>
      {lines.map((line) => (
        <BodyLine line={line} />
      ))}
    </Box>
  )
})

// 会变区块：仅最后一行 append
const GrowingLinesBlock: FC = () => {
  const [lines, setLines] = useState(() =>
    buildLines(growingLineCount, buildGrowingLineText),
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setLines((currentLines) => {
        const nextLines = [...currentLines]
        const lastIndex = nextLines.length - 1
        nextLines[lastIndex] = `${nextLines[lastIndex]}${growChar}`
        return nextLines
      })
    }, tickIntervalMs)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text dimColor>── 会变区块（仅最后一行 append）──</Text>
      {lines.map((line) => (
        <BodyLine line={line} />
      ))}
    </Box>
  )
}

const App: FC = () => {
  const {exit} = useApp()

  useInput((event) => {
    if (event.key === "q" && !event.ctrl && !event.meta) {
      exit()
    }
  })

  return (
    <Box flexDirection="column" flex={1}>
      <Text bold>Storm 长文本 append 闪屏对比</Text>
      <Text dimColor>
        上 {staticPrefixLineCount} 行静态 | 下 {growingLineCount} 行 | 每{" "}
        {tickIntervalMs / 1000}s 末行 +1「{growChar}」| 滚轮/PgUp/PgDn 滚动 | q
        退出
      </Text>
      <ScrollView flex={1}>
        <StaticPrefixBlock />
        <GrowingLinesBlock />
      </ScrollView>
    </Box>
  )
}

await render(<App />).waitUntilExit()
