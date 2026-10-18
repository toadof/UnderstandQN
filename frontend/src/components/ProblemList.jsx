import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DIFF_COLORS = {
  Easy: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40',
  Medium: 'text-amber-300 bg-amber-500/15 border-amber-500/40',
  Hard: 'text-rose-300 bg-rose-500/15 border-rose-500/40',
}

const TAG_COLORS = {
  'Hash Table': 'text-purple-300 bg-purple-500/10',
  'Two Pointers': 'text-pink-300 bg-pink-500/10',
  'Sliding Window': 'text-cyan-300 bg-cyan-500/10',
  'Binary Search': 'text-sky-300 bg-sky-500/10',
  'Sorting': 'text-indigo-300 bg-indigo-500/10',
  'Array': 'text-blue-300 bg-blue-500/10',
  'DP': 'text-amber-300 bg-amber-500/10',
  'Greedy': 'text-lime-300 bg-lime-500/10',
  'Stack': 'text-rose-300 bg-rose-500/10',
  'Prefix Sum': 'text-teal-300 bg-teal-500/10',
  'Math': 'text-violet-300 bg-violet-500/10',
}

const PROBLEMS = [
  {
    id: 1,
    num: '#1',
    title: 'Two Sum',
    difficulty: 'Easy',
    tag: 'Hash Table',
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    inputs: { nums: [2, 7, 11, 15], target: 9 },
    tags: { nums: 'array', seen: 'hashmap', i: 'pointer' },
  },
  {
    id: 2,
    num: '#26',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    tag: 'Two Pointers',
    code: `def remove_duplicates(nums):
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1`,
    inputs: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] },
    tags: { nums: 'array', slow: 'pointer', fast: 'pointer' },
  },
  {
    id: 3,
    num: '#704',
    title: 'Binary Search',
    difficulty: 'Easy',
    tag: 'Binary Search',
    code: `def search(nums, target):
    lo = 0
    hi = len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    inputs: { nums: [-1, 0, 3, 5, 9, 12], target: 9 },
    tags: { nums: 'array', lo: 'pointer', hi: 'pointer', mid: 'pointer' },
  },
  {
    id: 4,
    num: '#167',
    title: 'Two Sum II - Sorted Array',
    difficulty: 'Medium',
    tag: 'Two Pointers',
    code: `def two_sum_sorted(numbers, target):
    left = 0
    right = len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    inputs: { numbers: [2, 7, 11, 15], target: 9 },
    tags: { numbers: 'array', left: 'pointer', right: 'pointer' },
  },
  {
    id: 5,
    num: '#11',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tag: 'Two Pointers',
    code: `def max_area(height):
    left = 0
    right = len(height) - 1
    max_water = 0
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
    inputs: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] },
    tags: { height: 'array', left: 'pointer', right: 'pointer' },
  },
  {
    id: 6,
    num: '#53',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tag: 'DP',
    code: `def max_subarray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    inputs: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
    tags: { nums: 'array', i: 'pointer' },
  },
  {
    id: 7,
    num: '#3',
    title: 'Longest Substring Without Repeating',
    difficulty: 'Medium',
    tag: 'Sliding Window',
    code: `def length_of_longest_substring(s):
    char_set = {}
    left = 0
    max_len = 0
    for right in range(len(s)):
        if s[right] in char_set and char_set[s[right]] >= left:
            left = char_set[s[right]] + 1
        char_set[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    inputs: { s: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'] },
    tags: { s: 'array', char_set: 'hashmap', left: 'pointer', right: 'pointer' },
  },
  {
    id: 8,
    num: '#283',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    tag: 'Two Pointers',
    code: `def move_zeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1
    return nums`,
    inputs: { nums: [0, 1, 0, 3, 12] },
    tags: { nums: 'array', slow: 'pointer', fast: 'pointer' },
  },
  {
    id: 9,
    num: '#217',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tag: 'Hash Table',
    code: `def contains_duplicate(nums):
    seen = {}
    for i in range(len(nums)):
        num = nums[i]
        if num in seen:
            return True
        seen[num] = i
    return False`,
    inputs: { nums: [1, 2, 3, 1] },
    tags: { nums: 'array', seen: 'hashmap', i: 'pointer' },
  },
  {
    id: 10,
    num: '#75',
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    tag: 'Two Pointers',
    code: `def sort_colors(nums):
    low = 0
    mid = 0
    high = len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums`,
    inputs: { nums: [2, 0, 2, 1, 1, 0] },
    tags: { nums: 'array', low: 'pointer', mid: 'pointer', high: 'pointer' },
  },
  {
    id: 11,
    num: '#242',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    tag: 'Hash Table',
    code: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    count = {}
    for i in range(len(s)):
        ch = s[i]
        count[ch] = count.get(ch, 0) + 1
    for i in range(len(t)):
        ch = t[i]
        count[ch] = count.get(ch, 0) - 1
        if count[ch] < 0:
            return False
    return True`,
    inputs: { s: ['a', 'n', 'a', 'g', 'r', 'a', 'm'], t: ['n', 'a', 'g', 'a', 'r', 'a', 'm'] },
    tags: { s: 'array', t: 'array', count: 'hashmap' },
  },
  {
    id: 12,
    num: '#169',
    title: 'Majority Element',
    difficulty: 'Easy',
    tag: 'Hash Table',
    code: `def majority_element(nums):
    count = {}
    majority = len(nums) // 2
    for i in range(len(nums)):
        num = nums[i]
        count[num] = count.get(num, 0) + 1
        if count[num] > majority:
            return num
    return -1`,
    inputs: { nums: [2, 2, 1, 1, 1, 2, 2] },
    tags: { nums: 'array', count: 'hashmap', i: 'pointer' },
  },
  {
    id: 13,
    num: '#349',
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    tag: 'Hash Table',
    code: `def intersection(nums1, nums2):
    set1 = {}
    result = {}
    for i in range(len(nums1)):
        set1[nums1[i]] = True
    for i in range(len(nums2)):
        if nums2[i] in set1:
            result[nums2[i]] = True
    output = list(result.keys())
    return output`,
    inputs: { nums1: [1, 2, 2, 1], nums2: [2, 2] },
    tags: { nums1: 'array', nums2: 'array', set1: 'hashmap', result: 'hashmap' },
  },
  {
    id: 14,
    num: '#121',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tag: 'Array',
    code: `def max_profit(prices):
    min_price = prices[0]
    max_profit_val = 0
    for i in range(1, len(prices)):
        if prices[i] < min_price:
            min_price = prices[i]
        profit = prices[i] - min_price
        if profit > max_profit_val:
            max_profit_val = profit
    return max_profit_val`,
    inputs: { prices: [7, 1, 5, 3, 6, 4] },
    tags: { prices: 'array', i: 'pointer' },
  },
  {
    id: 15,
    num: '#560',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    tag: 'Prefix Sum',
    code: `def subarray_sum(nums, k):
    count = 0
    prefix_sum = 0
    prefix_map = {0: 1}
    for i in range(len(nums)):
        prefix_sum += nums[i]
        diff = prefix_sum - k
        if diff in prefix_map:
            count += prefix_map[diff]
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1
    return count`,
    inputs: { nums: [1, 1, 1, 2, 3], k: 3 },
    tags: { nums: 'array', prefix_map: 'hashmap', i: 'pointer' },
  },
]

export default function ProblemList({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSelect = (problem) => {
    onSelect({
      code: problem.code,
      inputs: problem.inputs,
      tags: problem.tags,
    })
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3.5 py-2 text-[12px] rounded-lg text-slate-300 hover:text-white transition-all border font-medium flex items-center gap-1.5 ${
          isOpen
            ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
            : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/50 hover:border-slate-600/50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Problem List
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-[420px] max-h-[520px] rounded-xl border border-slate-700/60 bg-slate-900/98 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
          >
            {/* Dropdown Header */}
            <div className="px-4 py-3 border-b border-slate-700/40 bg-slate-800/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow shadow-blue-500/30">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Top 15 LeetCode Problems</h3>
                    <p className="text-[10px] text-slate-500">Click to load code, inputs & tags</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/40">
                  {PROBLEMS.length} problems
                </span>
              </div>
            </div>

            {/* Problem List */}
            <div className="overflow-y-auto max-h-[440px] custom-scrollbar">
              {PROBLEMS.map((problem, index) => {
                const isHovered = hoveredId === problem.id
                return (
                  <motion.button
                    key={problem.id}
                    onClick={() => handleSelect(problem)}
                    onMouseEnter={() => setHoveredId(problem.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-all duration-150 border-b border-slate-800/40 ${
                      isHovered
                        ? 'bg-blue-500/8 border-l-2 border-l-blue-400'
                        : 'border-l-2 border-l-transparent hover:bg-slate-800/50'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                  >
                    {/* Number */}
                    <span className="font-mono text-[11px] text-slate-500 w-8 flex-shrink-0 font-bold">
                      {problem.num}
                    </span>

                    {/* Title */}
                    <span className={`text-[12.5px] font-semibold flex-1 truncate transition-colors ${
                      isHovered ? 'text-white' : 'text-slate-300'
                    }`}>
                      {problem.title}
                    </span>

                    {/* Tag */}
                    <span className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                      TAG_COLORS[problem.tag] || 'text-slate-400 bg-slate-800/60'
                    }`}>
                      {problem.tag}
                    </span>

                    {/* Difficulty */}
                    <span className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      DIFF_COLORS[problem.difficulty]
                    }`}>
                      {problem.difficulty}
                    </span>

                    {/* Arrow indicator on hover */}
                    <svg
                      className={`w-3 h-3 flex-shrink-0 transition-all duration-150 ${
                        isHovered ? 'text-blue-400 opacity-100 translate-x-0' : 'text-slate-600 opacity-0 -translate-x-1'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-700/40 bg-slate-800/30">
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Loads code, test inputs, and variable tags — then click <strong className="text-slate-400">Trace Execution</strong>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
