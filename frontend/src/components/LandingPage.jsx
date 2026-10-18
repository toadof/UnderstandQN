import { motion } from 'framer-motion'

const KW = 'text-pink-400 font-semibold'
const FN = 'text-sky-300 font-medium'
const TXT = 'text-slate-200'
const NUM = 'text-emerald-300 font-mono'
const STR = 'text-amber-300'
const CMT = 'text-slate-500 italic'

const DIFF_COLORS = {
  Easy: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/15',
  Medium: 'text-amber-300 border-amber-500/40 bg-amber-500/15',
  Hard: 'text-rose-300 border-rose-500/40 bg-rose-500/15',
}

const SNIPPETS = {
  twoSum: {
    title: 'two_sum.py · LC #1',
    complexity: 'O(n) Time · O(n) Space',
    lines: [
      [['def ', KW], ['two_sum', FN], ['(nums, target):', TXT]],
      [['    seen = {}', TXT]],
      [['    for', KW], [' i, num ', TXT], ['in', KW], [' enumerate(nums):', TXT]],
      [['        diff = target - num', TXT]],
      [['        if', KW], [' diff ', TXT], ['in', KW], [' seen:', TXT]],
      [['            return', KW], [' [seen[diff], i]', NUM]],
      [['        seen[num] = i', TXT]],
    ],
  },
  binarySearch: {
    title: 'binary_search.py · LC #704',
    complexity: 'O(log n) · O(1) Space',
    lines: [
      [['def ', KW], ['search', FN], ['(nums, target):', TXT]],
      [['    lo, hi = 0, len(nums) - 1', TXT]],
      [['    while', KW], [' lo <= hi:', TXT]],
      [['        mid = (lo + hi) // 2', TXT]],
      [['        if', KW], [' nums[mid] == target:', TXT]],
      [['            return', KW], [' mid', NUM]],
      [['        elif', KW], [' nums[mid] < target: lo = mid + 1', TXT]],
      [['        else', KW], [': hi = mid - 1', TXT]],
    ],
  },
  lruCache: {
    title: 'lru_cache.py · LC #146',
    complexity: 'O(1) Get & Put · Doubly-Linked',
    lines: [
      [['class ', KW], ['LRUCache', FN], [':', TXT]],
      [['    def ', KW], ['__init__', FN], ['(self, capacity):', TXT]],
      [['        self.cap = capacity; self.cache = {}', TXT]],
      [['    def ', KW], ['get', FN], ['(self, key):', TXT]],
      [['        if', KW], [' key ', TXT], ['not in', KW], [' self.cache:', TXT]],
      [['            return', KW], [' -1', NUM]],
      [['        self.order.move_to_end(key)', TXT]],
      [['        return', KW], [' self.cache[key]', TXT]],
    ],
  },
  reverseList: {
    title: 'reverse_list.py · LC #206',
    complexity: 'O(n) Time · O(1) Space',
    lines: [
      [['def ', KW], ['reverse_list', FN], ['(head):', TXT]],
      [['    prev, curr = ', TXT], ['None', KW], [', head', TXT]],
      [['    while', KW], [' curr:', TXT]],
      [['        nxt = curr.next', TXT]],
      [['        curr.next = prev', TXT]],
      [['        prev = curr', TXT]],
      [['        curr = nxt', TXT]],
      [['    return', KW], [' prev', TXT]],
    ],
  },
  coinChange: {
    title: 'coin_change_dp.py · LC #322',
    complexity: 'O(amount · n) · 1D DP',
    lines: [
      [['def ', KW], ['coin_change', FN], ['(coins, amount):', TXT]],
      [['    dp = [', TXT], ['float', KW], ['("inf")] * (amount + 1)', TXT]],
      [['    dp[0] = 0', NUM]],
      [['    for', KW], [' a ', TXT], ['in', KW], [' range(1, amount + 1):', TXT]],
      [['        for', KW], [' c ', TXT], ['in', KW], [' coins:', TXT]],
      [['            if', KW], [' a - c >= 0:', TXT]],
      [['                dp[a] = min(dp[a], 1 + dp[a - c])', TXT]],
      [['    return', KW], [' dp[amount] ', TXT], ['if', KW], [' dp[amount] != inf ', TXT], ['else', KW], [' -1', NUM]],
    ],
  },
  numIslands: {
    title: 'num_islands.py · LC #200',
    complexity: 'O(M · N) Grid DFS / BFS',
    lines: [
      [['def ', KW], ['num_islands', FN], ['(grid):', TXT]],
      [['    islands = 0', TXT]],
      [['    def ', KW], ['dfs', FN], ['(r, c):', TXT]],
      [['        if', KW], [' r < 0 or c < 0 or grid[r][c] != "1":', TXT]],
      [['            return', KW]],
      [['        grid[r][c] = "0"', TXT]],
      [['        for', KW], [' dr, dc ', TXT], ['in', KW], [' [(0,1),(0,-1),(1,0),(-1,0)]:', TXT]],
      [['            dfs(r + dr, c + dc)', TXT]],
    ],
  },
  trappingRain: {
    title: 'trap_rain.py · LC #42',
    complexity: 'O(n) Time · Two Pointers',
    lines: [
      [['def ', KW], ['trap', FN], ['(height):', TXT]],
      [['    l, r = 0, len(height) - 1', TXT]],
      [['    l_max, r_max, water = 0, 0, 0', TXT]],
      [['    while', KW], [' l < r:', TXT]],
      [['        if', KW], [' height[l] < height[r]:', TXT]],
      [['            l_max = max(l_max, height[l])', TXT]],
      [['            water += l_max - height[l]; l += 1', TXT]],
    ],
  },
  mergeIntervals: {
    title: 'merge_intervals.py · LC #56',
    complexity: 'O(n log n) · Sorting & Overlap',
    lines: [
      [['def ', KW], ['merge', FN], ['(intervals):', TXT]],
      [['    intervals.sort(key=', TXT], ['lambda', KW], [' x: x[0])', TXT]],
      [['    res = [intervals[0]]', TXT]],
      [['    for', KW], [' start, end ', TXT], ['in', KW], [' intervals[1:]:', TXT]],
      [['        if', KW], [' start <= res[-1][1]:', TXT]],
      [['            res[-1][1] = max(res[-1][1], end)', TXT]],
      [['        else', KW], [': res.append([start, end])', TXT]],
    ],
  },
}

const PROBLEM_CHIPS = [
  // Top Sector
  { title: 'Two Sum', num: '#1', difficulty: 'Easy', tag: 'Hash Table', className: 'left-[20%] top-[3%]', rotate: -3, delay: 0.2, anim: 'animate-float' },
  { title: 'Invert Tree', num: '#226', difficulty: 'Easy', tag: 'Tree BFS', className: 'left-[32%] top-[14%]', rotate: 2, delay: 0.5, anim: 'animate-float-reverse' },
  { title: 'Binary Search', num: '#704', difficulty: 'Easy', tag: 'Binary Search', className: 'left-[50%] top-[2%]', rotate: -2, delay: 1.1, anim: 'animate-float-slow' },
  { title: 'Rotated Array', num: '#33', difficulty: 'Medium', tag: 'Divide & Conquer', className: 'left-[66%] top-[2%]', rotate: 3, delay: 0.7, anim: 'animate-float' },
  { title: 'LRU Cache', num: '#146', difficulty: 'Medium', tag: 'Design', className: 'right-[20%] top-[3%]', rotate: 3, delay: 1.8, anim: 'animate-float-reverse' },

  // Upper Sides
  { title: 'Valid Parentheses', num: '#20', difficulty: 'Easy', tag: 'Stack', className: 'left-[1.5%] top-[24%]', rotate: 4, delay: 1.5, anim: 'animate-float-slow' },
  { title: 'Climbing Stairs', num: '#70', difficulty: 'Easy', tag: 'DP', className: 'left-[13%] top-[27%]', rotate: -3, delay: 2.2, anim: 'animate-float' },
  { title: 'Trapping Rain Water', num: '#42', difficulty: 'Hard', tag: 'Two Pointers', className: 'right-[1.5%] top-[24%]', rotate: -3, delay: 0.9, anim: 'animate-float' },
  { title: 'Merge k Sorted Lists', num: '#23', difficulty: 'Hard', tag: 'Min-Heap', className: 'right-[14%] top-[28%]', rotate: 3, delay: 1.4, anim: 'animate-float-reverse' },

  // Center Sides
  { title: 'Reverse Linked List', num: '#206', difficulty: 'Easy', tag: 'Linked List', className: 'left-[1.5%] top-[58%]', rotate: -3, delay: 1.0, anim: 'animate-float' },
  { title: 'Linked List Cycle', num: '#141', difficulty: 'Easy', tag: 'Two Pointers', className: 'left-[12%] top-[62%]', rotate: 2, delay: 2.4, anim: 'animate-float-slow' },
  { title: 'Longest Substring', num: '#3', difficulty: 'Medium', tag: 'Sliding Window', className: 'left-[1%] top-[68%]', rotate: -2, delay: 0.8, anim: 'animate-float-reverse' },

  { title: 'Container With Water', num: '#11', difficulty: 'Medium', tag: 'Two Pointers', className: 'right-[2%] top-[58%]', rotate: 3, delay: 1.9, anim: 'animate-float' },
  { title: '3Sum', num: '#15', difficulty: 'Medium', tag: 'Sorting', className: 'right-[14%] top-[62%]', rotate: -2, delay: 2.7, anim: 'animate-float-slow' },
  { title: 'Min Window Substring', num: '#76', difficulty: 'Hard', tag: 'Sliding Window', className: 'right-[1.5%] top-[68%]', rotate: 2, delay: 1.2, anim: 'animate-float-reverse' },

  // Bottom Sector
  { title: 'Coin Change', num: '#322', difficulty: 'Medium', tag: 'DP', className: 'left-[1.5%] bottom-[27%]', rotate: -3, delay: 1.3, anim: 'animate-float' },
  { title: 'House Robber', num: '#198', difficulty: 'Medium', tag: '1D DP', className: 'left-[10%] bottom-[23%]', rotate: 2, delay: 0.6, anim: 'animate-float-slow' },
  { title: 'Course Schedule', num: '#207', difficulty: 'Medium', tag: 'TopoSort', className: 'left-[30%] bottom-[12%]', rotate: -2, delay: 0.4, anim: 'animate-float-slow' },
  { title: 'Implement Trie', num: '#208', difficulty: 'Medium', tag: 'Prefix Tree', className: 'left-[46%] bottom-[12%]', rotate: 2, delay: 1.7, anim: 'animate-float' },
  { title: 'Median 2 Arrays', num: '#4', difficulty: 'Hard', tag: 'Binary Search', className: 'left-[62%] bottom-[12%]', rotate: -3, delay: 2.5, anim: 'animate-float-reverse' },

  { title: 'Number of Islands', num: '#200', difficulty: 'Medium', tag: 'DFS / BFS', className: 'right-[1.5%] bottom-[27%]', rotate: 3, delay: 0.8, anim: 'animate-float' },
  { title: 'Merge Intervals', num: '#56', difficulty: 'Medium', tag: 'Intervals', className: 'right-[11%] bottom-[22%]', rotate: -2, delay: 2.0, anim: 'animate-float-slow' },
  { title: 'Clone Graph', num: '#133', difficulty: 'Medium', tag: 'Graph DFS', className: 'right-[19%] bottom-[2%]', rotate: 2, delay: 1.1, anim: 'animate-float' },
  { title: 'Find Median Stream', num: '#295', difficulty: 'Hard', tag: 'Two Heaps', className: 'right-[5%] bottom-[2%]', rotate: -3, delay: 1.5, anim: 'animate-float-reverse' },
  { title: 'Maximum Subarray', num: '#53', difficulty: 'Medium', tag: "Kadane's", className: 'left-[2%] bottom-[2%]', rotate: 3, delay: 1.6, anim: 'animate-float' },
  { title: 'Longest Inc Subseq', num: '#300', difficulty: 'Medium', tag: 'DP', className: 'left-[16%] bottom-[1%]', rotate: -2, delay: 2.1, anim: 'animate-float-reverse' },
]

const DSA_TOPICS = [
  { label: 'Dynamic Programming', complexity: 'O(n²)', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40', className: 'left-[1.5%] top-[32%]', rotate: -2 },
  { label: 'Two Pointers Technique', complexity: 'O(n)', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40', className: 'left-[16%] top-[32%]', rotate: 3 },
  { label: 'Monotonic Stack', complexity: 'O(n)', color: 'border-pink-500/40 text-pink-300 bg-pink-950/40', className: 'right-[16%] top-[32%]', rotate: -2 },
  { label: 'Doubly-Linked List + Map', complexity: 'O(1)', color: 'border-blue-500/40 text-blue-300 bg-blue-950/40', className: 'right-[1.5%] top-[32%]', rotate: 2 },
  { label: "Floyd's Tortoise & Hare", complexity: 'O(1) Space', color: 'border-violet-500/40 text-violet-300 bg-violet-950/40', className: 'left-[15%] top-[40%]', rotate: -3 },
  { label: 'Sliding Window', complexity: 'O(n)', color: 'border-amber-500/40 text-amber-300 bg-amber-950/40', className: 'left-[3%] top-[64%]', rotate: 2 },
  { label: 'Divide & Conquer', complexity: 'O(n log n)', color: 'border-sky-500/40 text-sky-300 bg-sky-950/40', className: 'right-[16%] top-[40%]', rotate: 3 },
  { label: 'Prefix Sums & Intervals', complexity: 'O(1) Query', color: 'border-teal-500/40 text-teal-300 bg-teal-950/40', className: 'right-[3%] top-[64%]', rotate: -2 },
  { label: "Kadane's Algorithm", complexity: 'O(n)', color: 'border-lime-500/40 text-lime-300 bg-lime-950/40', className: 'left-[1%] bottom-[19%]', rotate: 3 },
  { label: 'Topological Sort (Kahn)', complexity: 'O(V + E)', color: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40', className: 'left-[33%] bottom-[1%]', rotate: -2 },
  { label: 'Disjoint Set Union (DSU)', complexity: 'O(α(n))', color: 'border-purple-500/40 text-purple-300 bg-purple-950/40', className: 'left-[51%] bottom-[1%]', rotate: 2 },
  { label: 'Trie (Prefix Tree)', complexity: 'O(L)', color: 'border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-950/40', className: 'right-[1.5%] bottom-[19%]', rotate: -3 },
  { label: 'Breadth-First Search (BFS)', complexity: 'Queue', color: 'border-rose-500/40 text-rose-300 bg-rose-950/40', className: 'right-[14%] bottom-[1%]', rotate: 2 },
]

export default function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background with dense, visible, aesthetic DSA galaxy */}
      <Background />

      {/* Centered Vignette — isolates the central hero so copy stays razor-sharp while background shines */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse 55% 48% at 50% 50%, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.82) 35%, rgba(2,6,23,0.18) 68%, rgba(2,6,23,0.25) 100%)',
        }}
      />

      {/* Hero Section */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/40 ring-1 ring-blue-400/50 border border-blue-400/40"
          >
            <span className="text-2xl font-black text-white">U</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
            className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl drop-shadow-xl"
          >
            Understood
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              QN
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: 'easeOut' }}
            className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg font-medium drop-shadow-md"
          >
            Stop memorizing DSA. Watch your code <span className="text-white font-bold underline decoration-blue-400 decoration-2 underline-offset-4">think</span> — line by line.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease: 'easeOut' }}
            className="mt-2.5 max-w-xl text-sm text-slate-400"
          >
            Paste your solution, tag your variables, and see real execution traces animate
            arrays, hashmaps, trees, and pointers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
            className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row"
          >
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-500/35 border border-blue-400/40 transition-colors hover:from-blue-400 hover:to-blue-500 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Visualize your code
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-xl border border-slate-700/80 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800/90 hover:text-white hover:border-slate-500/80 cursor-pointer shadow-lg shadow-black/40"
            >
              Try the Two Sum demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-[12px] text-slate-400 font-medium"
          >
            {[
              'Real Python execution',
              'Your own custom inputs',
              'Step-by-step playback',
              'Arrays · Hashmaps · Pointers · DP',
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                {item}
              </span>
            ))}
          </motion.div>

          <div className="mt-6 text-[11px] text-slate-500 font-medium">
            Built for placement prep — deterministic traces, not AI hallucinations.
          </div>
        </div>
      </div>
    </div>
  )
}

function Background() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Background dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient colored glowing orbs for depth and rich aesthetic */}
      <div className="absolute left-[8%] top-[10%] h-[460px] w-[460px] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="absolute right-[8%] top-[8%] h-[480px] w-[480px] rounded-full bg-purple-600/15 blur-[130px]" />
      <div className="absolute left-[8%] bottom-[8%] h-[500px] w-[500px] rounded-full bg-emerald-600/12 blur-[130px]" />
      <div className="absolute right-[8%] bottom-[6%] h-[520px] w-[520px] rounded-full bg-cyan-600/15 blur-[140px]" />
      <div className="absolute left-1/2 top-[45%] h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

      {/* 1. CODE SNIPPET CARDS (Dense, highly visible, rich syntax colors) */}
      
      {/* Top Left: Two Sum */}
      <FloatingCard className="left-[1.5%] top-[2%] w-68" rotate={-3} delay={0} anim="animate-float">
        <CardHeader title={SNIPPETS.twoSum.title} badge={SNIPPETS.twoSum.complexity} accent="blue" />
        <Code lines={SNIPPETS.twoSum.lines} />
      </FloatingCard>

      {/* Top Mid: Binary Search */}
      <FloatingCard className="left-[54%] top-[1%] w-62" rotate={2.5} delay={1.4} anim="animate-float-slow">
        <CardHeader title={SNIPPETS.binarySearch.title} badge={SNIPPETS.binarySearch.complexity} accent="cyan" />
        <Code lines={SNIPPETS.binarySearch.lines} />
      </FloatingCard>

      {/* Top Right: LRU Cache */}
      <FloatingCard className="right-[1.5%] top-[2%] w-72" rotate={3.5} delay={0.6} anim="animate-float-reverse">
        <CardHeader title={SNIPPETS.lruCache.title} badge={SNIPPETS.lruCache.complexity} accent="purple" />
        <Code lines={SNIPPETS.lruCache.lines} />
      </FloatingCard>

      {/* Mid Left: Reverse Linked List */}
      <FloatingCard className="left-[1.5%] top-[38%] w-64" rotate={3} delay={1.8} anim="animate-float">
        <CardHeader title={SNIPPETS.reverseList.title} badge={SNIPPETS.reverseList.complexity} accent="emerald" />
        <Code lines={SNIPPETS.reverseList.lines} />
      </FloatingCard>

      {/* Mid Right: Trapping Rain Water */}
      <FloatingCard className="right-[1.5%] top-[38%] w-68" rotate={-3.5} delay={2.3} anim="animate-float-reverse">
        <CardHeader title={SNIPPETS.trappingRain.title} badge={SNIPPETS.trappingRain.complexity} accent="pink" />
        <Code lines={SNIPPETS.trappingRain.lines} />
      </FloatingCard>

      {/* Bottom Left: Coin Change 1D DP */}
      <FloatingCard className="left-[1.5%] bottom-[2%] w-68" rotate={-3} delay={1.0} anim="animate-float-slow">
        <CardHeader title={SNIPPETS.coinChange.title} badge={SNIPPETS.coinChange.complexity} accent="amber" />
        <Code lines={SNIPPETS.coinChange.lines} />
      </FloatingCard>

      {/* Bottom Mid-Right: Merge Intervals */}
      <FloatingCard className="right-[16%] bottom-[8%] w-58" rotate={-2} delay={2.5} anim="animate-float">
        <CardHeader title={SNIPPETS.mergeIntervals.title} badge={SNIPPETS.mergeIntervals.complexity} accent="sky" />
        <Code lines={SNIPPETS.mergeIntervals.lines} />
      </FloatingCard>

      {/* Bottom Right: Number of Islands DFS */}
      <FloatingCard className="right-[1.5%] bottom-[2%] w-68" rotate={2.8} delay={1.7} anim="animate-float-reverse">
        <CardHeader title={SNIPPETS.numIslands.title} badge={SNIPPETS.numIslands.complexity} accent="teal" />
        <Code lines={SNIPPETS.numIslands.lines} />
      </FloatingCard>


      {/* 2. MINI ALGO & DATA STRUCTURE VISUALIZATIONS */}

      {/* Mini Array with Pointers (Two Sum: nums=[2, 7, 11, 15], target=9) */}
      <FloatingCard className="left-[18%] top-[14%] w-52" rotate={2} delay={0.9} anim="animate-float-slow">
        <CardHeader title="nums · array" badge="target=9" accent="blue" />
        <MiniArray values={[2, 7, 11, 15]} highlightIdx={1} compareIdx={0} />
      </FloatingCard>

      {/* Mini Binary Tree (Invert Binary Tree / Tree Traversal) */}
      <FloatingCard className="left-[32%] top-[1.5%] w-48" rotate={-2.5} delay={1.6} anim="animate-float">
        <CardHeader title="root · binary tree" badge="invert_tree" accent="cyan" />
        <MiniBinaryTree />
      </FloatingCard>

      {/* Mini Hash Map (seen lookup table) */}
      <FloatingCard className="right-[17%] top-[14%] w-46" rotate={-3} delay={2.0} anim="animate-float-reverse">
        <CardHeader title="seen · hashmap" badge="O(1) lookup" accent="purple" />
        <MiniHash entries={[['2', 0], ['7', 1], ['11', 2]]} />
      </FloatingCard>

      {/* Mini Linked List Pointer Traversal */}
      <FloatingCard className="left-[14%] top-[48%] w-52" rotate={-2} delay={2.4} anim="animate-float-reverse">
        <CardHeader title="head · linked list" badge="prev -> curr" accent="emerald" />
        <MiniLinkedList />
      </FloatingCard>

      {/* Mini Two Pointers Container With Water */}
      <FloatingCard className="right-[15%] top-[48%] w-54" rotate={2.5} delay={1.2} anim="animate-float">
        <CardHeader title="heights · container" badge="area = 49" accent="pink" />
        <MiniTwoPointers />
      </FloatingCard>

      {/* Mini DP Table (Unique Paths 3x4 Matrix) */}
      <FloatingCard className="left-[15%] bottom-[8%] w-48" rotate={3} delay={0.7} anim="animate-float">
        <CardHeader title="dp[r][c] · grid paths" badge="dp[2][3] = 10" accent="amber" />
        <MiniDPTable />
      </FloatingCard>

      {/* Mini Stack (Valid Parentheses LIFO) */}
      <FloatingCard className="left-[34%] bottom-[2%] w-44" rotate={-2} delay={2.2} anim="animate-float-slow">
        <CardHeader title="stack · LIFO match" badge="stack.pop()" accent="sky" />
        <MiniStack />
      </FloatingCard>

      {/* Mini Graph (Course Schedule / Dijkstra BFS) */}
      <FloatingCard className="left-[54%] bottom-[2%] w-48" rotate={2.5} delay={1.5} anim="animate-float-reverse">
        <CardHeader title="graph · topological" badge="DAG in_deg=0" accent="indigo" />
        <MiniGraph />
      </FloatingCard>


      {/* 3. FAMOUS LEETCODE PROBLEM CHIPS */}
      {PROBLEM_CHIPS.map((p) => (
        <Chip key={p.title} {...p} />
      ))}


      {/* 4. DSA TOPIC & ALGORITHM BADGES */}
      {DSA_TOPICS.map((t) => (
        <TopicPill key={t.label} {...t} />
      ))}
    </div>
  )
}

function FloatingCard({ className, rotate = 0, delay = 0, anim = 'animate-float', children }) {
  return (
    <div
      className={`pointer-events-auto absolute hidden select-none rounded-xl border border-slate-700/70 bg-slate-900/85 p-3 shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.04] hover:border-blue-400/60 hover:bg-slate-900/95 hover:shadow-blue-500/10 md:block opacity-85 hover:opacity-100 blur-[0.6px] hover:blur-none ${anim} ${className}`}
      style={{ '--rot': `${rotate}deg`, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

function Chip({ title, num, difficulty, tag, className, rotate = 0, delay = 0, anim = 'animate-float' }) {
  return (
    <div
      className={`pointer-events-auto absolute hidden select-none items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/85 px-3 py-1 shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-slate-500 hover:bg-slate-800/95 md:flex opacity-85 hover:opacity-100 blur-[0.4px] hover:blur-none ${anim} ${className}`}
      style={{ '--rot': `${rotate}deg`, animationDelay: `${delay}s` }}
    >
      <span className="font-mono text-[10px] font-bold text-slate-400">{num}</span>
      <span className="whitespace-nowrap text-xs font-semibold text-slate-200">{title}</span>
      <span className={`rounded-full border px-1.5 py-0.5 text-[9.5px] font-semibold leading-none ${DIFF_COLORS[difficulty]}`}>
        {difficulty}
      </span>
      {tag && (
        <span className="hidden font-mono text-[9px] text-slate-400 xl:inline">
          · {tag}
        </span>
      )}
    </div>
  )
}

function TopicPill({ label, complexity, color, className, rotate = 0 }) {
  return (
    <div
      className={`pointer-events-auto absolute hidden select-none items-center gap-2 rounded-lg border px-2.5 py-1 font-mono text-[10px] font-medium shadow-md shadow-black/30 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:brightness-125 lg:flex opacity-85 hover:opacity-100 blur-[0.4px] hover:blur-none ${color} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
      <span className="rounded bg-black/40 px-1 py-0.5 text-[9px] font-bold text-slate-300">
        {complexity}
      </span>
    </div>
  )
}

function CardHeader({ title, badge, accent = 'blue' }) {
  const dotColors = {
    blue: 'bg-blue-400 shadow-blue-400/60',
    cyan: 'bg-cyan-400 shadow-cyan-400/60',
    purple: 'bg-purple-400 shadow-purple-400/60',
    emerald: 'bg-emerald-400 shadow-emerald-400/60',
    pink: 'bg-pink-400 shadow-pink-400/60',
    amber: 'bg-amber-400 shadow-amber-400/60',
    sky: 'bg-sky-400 shadow-sky-400/60',
    teal: 'bg-teal-400 shadow-teal-400/60',
    indigo: 'bg-indigo-400 shadow-indigo-400/60',
  }

  return (
    <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full shadow-sm ${dotColors[accent] || 'bg-slate-400'}`} />
        <span className="font-mono text-[10px] font-semibold text-slate-300 tracking-wide">{title}</span>
      </div>
      {badge && (
        <span className="font-mono text-[8.5px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
          {badge}
        </span>
      )}
    </div>
  )
}

function Code({ lines }) {
  return (
    <pre className="overflow-hidden font-mono text-[10px] leading-[1.6]">
      {lines.map((tokens, i) => (
        <div key={i} className="whitespace-pre">
          {tokens.map(([text, cls], j) => (
            <span key={j} className={cls}>
              {text}
            </span>
          ))}
        </div>
      ))}
    </pre>
  )
}

function MiniArray({ values, highlightIdx = null, compareIdx = null }) {
  const max = Math.max(...values, 1)
  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex h-12 items-end gap-1.5 px-1 justify-center">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-[8.5px] font-bold text-slate-300">{v}</span>
            <div
              className={`w-5 rounded-t transition-all ${
                i === highlightIdx
                  ? 'bg-amber-400 shadow-md shadow-amber-500/40 ring-1 ring-amber-300'
                  : i === compareIdx
                  ? 'bg-pink-400 shadow-md shadow-pink-500/40'
                  : 'bg-blue-500/80'
              }`}
              style={{ height: `${Math.max((v / max) * 30, 5)}px` }}
            />
            <span className="font-mono text-[7.5px] font-medium text-slate-400">[{i}]</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center px-1 text-[8.5px] font-mono text-slate-400 border-t border-slate-800 pt-0.5">
        <span className="text-pink-300 font-semibold">diff = 7</span>
        <span className="text-amber-300 font-semibold">seen[7] = 0!</span>
      </div>
    </div>
  )
}

function MiniTwoPointers() {
  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
  const leftIdx = 1
  const rightIdx = 8

  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex h-11 items-end gap-1 px-1 justify-center relative">
        {/* Shaded water container between L and R */}
        <div
          className="absolute bottom-3 bg-sky-500/25 border-t border-sky-400/60 rounded-xs"
          style={{
            left: '16px',
            right: '6px',
            height: '22px',
          }}
        />
        {heights.map((h, i) => (
          <div key={i} className="flex flex-col items-center z-10">
            <div
              className={`w-3 rounded-t ${
                i === leftIdx || i === rightIdx
                  ? 'bg-pink-400 ring-1 ring-pink-300 shadow-sm shadow-pink-500/50'
                  : 'bg-slate-700'
              }`}
              style={{ height: `${(h / 8) * 32}px` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between px-1 text-[8px] font-mono font-medium text-slate-300">
        <span className="text-pink-300 font-bold">L=1</span>
        <span className="text-sky-300 font-bold">Area = 7×7 = 49</span>
        <span className="text-pink-300 font-bold">R=8</span>
      </div>
    </div>
  )
}

function MiniBinaryTree() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <svg className="w-40 h-14" viewBox="0 0 176 60">
        {/* Connector lines */}
        <line x1="88" y1="10" x2="48" y2="30" stroke="#475569" strokeWidth="1.5" />
        <line x1="88" y1="10" x2="128" y2="30" stroke="#475569" strokeWidth="1.5" />
        <line x1="48" y1="30" x2="28" y2="50" stroke="#334155" strokeWidth="1.2" />
        <line x1="48" y1="30" x2="68" y2="50" stroke="#334155" strokeWidth="1.2" />
        <line x1="128" y1="30" x2="108" y2="50" stroke="#334155" strokeWidth="1.2" />
        <line x1="128" y1="30" x2="148" y2="50" stroke="#334155" strokeWidth="1.2" />

        {/* Root Node */}
        <circle cx="88" cy="10" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="88" y="13" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">4</text>

        {/* Level 1 Nodes */}
        <circle cx="48" cy="30" r="7.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
        <text x="48" y="33" textAnchor="middle" fill="#c084fc" fontSize="7.5" fontWeight="bold" fontFamily="monospace">2</text>

        <circle cx="128" cy="30" r="7.5" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
        <text x="128" y="33" textAnchor="middle" fill="#c084fc" fontSize="7.5" fontWeight="bold" fontFamily="monospace">7</text>

        {/* Leaves */}
        <circle cx="28" cy="50" r="5.5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <text x="28" y="52.5" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="monospace">1</text>

        <circle cx="68" cy="50" r="5.5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <text x="68" y="52.5" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="monospace">3</text>

        <circle cx="108" cy="50" r="5.5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <text x="108" y="52.5" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="monospace">6</text>

        <circle cx="148" cy="50" r="5.5" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
        <text x="148" y="52.5" textAnchor="middle" fill="#34d399" fontSize="6.5" fontFamily="monospace">9</text>
      </svg>
    </div>
  )
}

function MiniGraph() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <svg className="w-42 h-12" viewBox="0 0 176 50">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>

        {/* Edges */}
        <line x1="28" y1="25" x2="80" y2="12" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow-green)" />
        <line x1="80" y1="12" x2="148" y2="25" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow-green)" />
        <line x1="28" y1="25" x2="80" y2="38" stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrow)" />
        <line x1="80" y1="38" x2="148" y2="25" stroke="#475569" strokeWidth="1.2" markerEnd="url(#arrow)" />

        {/* Edge weights */}
        <text x="48" y="14" fill="#34d399" fontSize="7" fontFamily="monospace">w=2</text>
        <text x="115" y="14" fill="#34d399" fontSize="7" fontFamily="monospace">w=1</text>
        <text x="48" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace">w=4</text>
        <text x="115" y="40" fill="#94a3b8" fontSize="7" fontFamily="monospace">w=5</text>

        {/* Nodes */}
        <circle cx="28" cy="25" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="28" y="28" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold" fontFamily="monospace">A</text>

        <circle cx="80" cy="12" r="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
        <text x="80" y="15" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="bold" fontFamily="monospace">B</text>

        <circle cx="80" cy="38" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
        <text x="80" y="41" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontWeight="bold" fontFamily="monospace">C</text>

        <circle cx="148" cy="25" r="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
        <text x="148" y="28" textAnchor="middle" fill="#34d399" fontSize="7.5" fontWeight="bold" fontFamily="monospace">D</text>
      </svg>
      <span className="text-[8px] font-mono text-emerald-300 font-semibold">Shortest: A → B → D (dist=3)</span>
    </div>
  )
}

function MiniDPTable() {
  const grid = [
    [1, 1, 1, 1],
    [1, 2, 3, 4],
    [1, 3, 6, 10],
  ]

  return (
    <div className="space-y-1 pt-0.5">
      <div className="grid grid-cols-4 gap-1">
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`flex h-5 items-center justify-center rounded border font-mono text-[8.5px] font-semibold transition-colors ${
                r === 2 && c === 3
                  ? 'border-amber-400 bg-amber-500/25 text-amber-200 ring-1 ring-amber-300'
                  : r === 2 || c === 3
                  ? 'border-slate-700 bg-slate-800/80 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400'
              }`}
            >
              {val}
            </div>
          )),
        )}
      </div>
      <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 pt-0.5">
        <span className="text-slate-400">dp[r][c] = top + left</span>
        <span className="text-amber-300 font-bold">ans = 10</span>
      </div>
    </div>
  )
}

function MiniHash({ entries }) {
  return (
    <div className="space-y-1 pt-0.5">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between rounded border border-slate-700/60 bg-slate-950/70 px-2 py-0.5"
        >
          <span className="font-mono text-[9.5px] font-semibold text-amber-300">{k}</span>
          <span className="text-[9px] text-slate-500 font-mono">hash →</span>
          <span className="font-mono text-[9.5px] font-bold text-emerald-300">idx {v}</span>
        </div>
      ))}
    </div>
  )
}

function MiniLinkedList() {
  const nodes = [12, 99, 37, 42]
  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex items-center justify-center gap-1 font-mono text-[9px]">
        {nodes.map((n, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-md border font-bold ${
                i === 1
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : i === 0
                  ? 'border-violet-400 bg-violet-500/20 text-violet-300'
                  : 'border-slate-700 bg-slate-800/80 text-slate-300'
              }`}
            >
              {n}
            </div>
            {i < nodes.length - 1 ? (
              <span className="text-slate-500 font-bold">→</span>
            ) : (
              <span className="text-slate-600 text-[8px]">→ ∅</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between px-1 text-[8px] font-mono font-medium">
        <span className="text-violet-300 font-semibold">prev=12</span>
        <span className="text-emerald-300 font-semibold">curr=99</span>
        <span className="text-slate-400">curr.next=prev</span>
      </div>
    </div>
  )
}

function MiniStack() {
  const stack = ['[', '{', '(']
  return (
    <div className="space-y-1 pt-0.5">
      <div className="flex flex-col gap-0.5 items-center">
        {stack.map((item, idx) => (
          <div
            key={idx}
            className={`w-full flex items-center justify-between px-2 py-0.5 rounded border font-mono text-[9.5px] font-bold ${
              idx === 0
                ? 'border-pink-400 bg-pink-500/20 text-pink-300'
                : 'border-slate-700 bg-slate-800/60 text-slate-300'
            }`}
          >
            <span>{item}</span>
            <span className="text-[7.5px] text-slate-400 font-normal">
              {idx === 0 ? 'TOP' : `d=${3 - idx}`}
            </span>
          </div>
        ))}
      </div>
      <div className="text-[8px] font-mono text-center text-slate-400 pt-0.5">
        peek() == pairs[ch] <span className="text-emerald-300 font-bold">✓ Match</span>
      </div>
    </div>
  )
}
