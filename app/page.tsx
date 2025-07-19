"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, RotateCcw } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Download, Expand } from "lucide-react"

// 更新后的地点列表
const locations = [
  "梦墟入口",
  "梦境小径",
  "梦墟",
  "白虎兵冢",
  "浮岛遗迹",
  "时之沙漏",
  "青龙之渊",
  "朱雀焚天",
  "墨鳞幽境",
  "玄武之碑",
  "星穹残响",
  "心像画廊",
  "海市书库",
  "熵之核心",
  "琴弦回廊",
  "齿轮天井",
  "星骸王座",
  "归墟之眼",
  "虚空织网",
  "熵寂回廊",
  "星髓矿脉",
]

// 根据您提供的正确连接关系构建图
const connections: { [key: string]: string[] } = {
  梦墟入口: ["梦境小径"],
  梦境小径: ["梦墟入口", "梦墟", "白虎兵冢", "浮岛遗迹"],
  梦墟: ["梦境小径", "梦墟", "心像画廊", "玄武之碑", "星髓矿脉"],
  白虎兵冢: ["梦境小径", "时之沙漏", "朱雀焚天"],
  浮岛遗迹: ["梦境小径", "时之沙漏"],
  时之沙漏: ["浮岛遗迹", "白虎兵冢", "青龙之渊"],
  青龙之渊: ["时之沙漏", "琴弦回廊", "虚空织网"],
  朱雀焚天: ["白虎兵冢", "墨鳞幽境"],
  墨鳞幽境: ["朱雀焚天", "玄武之碑"],
  玄武之碑: ["墨鳞幽境", "星穹残响", "梦墟"],
  星穹残响: ["玄武之碑", "心像画廊", "星髓矿脉"],
  心像画廊: ["星穹残响", "海市书库", "梦墟"],
  海市书库: ["心像画廊", "熵之核心"],
  熵之核心: ["海市书库", "星骸王座", "熵寂回廊"],
  琴弦回廊: ["青龙之渊", "齿轮天井"],
  齿轮天井: ["琴弦回廊", "星骸王座"],
  星骸王座: ["齿轮天井", "熵之核心", "归墟之眼"],
  归墟之眼: ["星骸王座", "虚空织网", "星髓矿脉"],
  虚空织网: ["青龙之渊", "归墟之眼", "熵寂回廊"],
  熵寂回廊: ["虚空织网", "熵之核心"],
  星髓矿脉: ["梦墟", "星穹残响", "归墟之眼"],
}

// Dijkstra算法实现
function findShortestPath(start: string, end: string): string[] {
  if (start === end) return [start]

  const distances: { [key: string]: number } = {}
  const previous: { [key: string]: string | null } = {}
  const unvisited = new Set(locations)

  // 初始化距离
  locations.forEach((location) => {
    distances[location] = location === start ? 0 : Number.POSITIVE_INFINITY
    previous[location] = null
  })

  while (unvisited.size > 0) {
    // 找到未访问节点中距离最小的
    const current = Array.from(unvisited).reduce((min, location) =>
      distances[location] < distances[min] ? location : min,
    )

    if (distances[current] === Number.POSITIVE_INFINITY) break

    unvisited.delete(current)

    if (current === end) break

    // 更新邻居节点的距离
    const neighbors = connections[current] || []
    neighbors.forEach((neighbor) => {
      if (unvisited.has(neighbor)) {
        const newDistance = distances[current] + 1
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance
          previous[neighbor] = current
        }
      }
    })
  }

  // 重构路径
  const path: string[] = []
  let current = end

  while (current !== null) {
    path.unshift(current)
    current = previous[current]
  }

  return path[0] === start ? path : []
}

export default function DreamlandPathfinder() {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [path, setPath] = useState<string[]>([])
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)

  const findPath = useCallback(() => {
    if (startLocation && endLocation) {
      const shortestPath = findShortestPath(startLocation, endLocation)
      setPath(shortestPath)
    }
  }, [startLocation, endLocation])

  const reset = () => {
    setStartLocation("")
    setEndLocation("")
    setPath([])
  }

  const filteredLocationsStart = useMemo(
    () => locations.filter((location) => location.toLowerCase().includes(startLocation.toLowerCase())),
    [startLocation],
  )

  const filteredLocationsEnd = useMemo(
    () => locations.filter((location) => location.toLowerCase().includes(endLocation.toLowerCase())),
    [endLocation],
  )

  const downloadMap = () => {
    const link = document.createElement("a")
    link.href = "/dreamland-map.png"
    link.download = "梦墟地图.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* 添加装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3 drop-shadow-2xl">
            <div className="p-2 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-400/30">
              <MapPin className="w-8 h-8 text-blue-300" />
            </div>
            梦墟地图导航
          </h1>
          <p className="text-blue-200 text-lg font-medium">输入起点和终点，快速找到最短路径</p>
          <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 控制面板 */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  路径规划
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 起点选择 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">起点</label>
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openStart}
                        className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {startLocation || "选择起点..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="搜索地点..."
                          value={startLocation}
                          onValueChange={setStartLocation}
                        />
                        <CommandList>
                          <CommandEmpty>未找到地点</CommandEmpty>
                          <CommandGroup>
                            {filteredLocationsStart.map((location) => (
                              <CommandItem
                                key={location}
                                value={location}
                                onSelect={() => {
                                  setStartLocation(location)
                                  setOpenStart(false)
                                }}
                              >
                                {location}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 终点选择 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">终点</label>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openEnd}
                        className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {endLocation || "选择终点..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="搜索地点..." value={endLocation} onValueChange={setEndLocation} />
                        <CommandList>
                          <CommandEmpty>未找到地点</CommandEmpty>
                          <CommandGroup>
                            {filteredLocationsEnd.map((location) => (
                              <CommandItem
                                key={location}
                                value={location}
                                onSelect={() => {
                                  setEndLocation(location)
                                  setOpenEnd(false)
                                }}
                              >
                                {location}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button
                    onClick={findPath}
                    disabled={!startLocation || !endLocation}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    寻路
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                {/* 路径结果 */}
                {path.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">最短路径 ({path.length - 1} 步)</label>
                    <div className="space-y-1">
                      {path.map((location, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge
                            variant={index === 0 ? "default" : index === path.length - 1 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {index + 1}
                          </Badge>
                          <span className="text-white text-sm">{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 地图显示 - 增强版 */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    梦墟地图
                  </CardTitle>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <Expand className="w-4 h-4 mr-1" />
                          查看大图
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] p-0">
                        <DialogHeader className="p-4 pb-2">
                          <DialogTitle className="flex items-center justify-between">
                            <span>梦墟地图 - 高清大图</span>
                            <Button onClick={downloadMap} variant="outline" size="sm" className="ml-4 bg-transparent">
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto p-4 pt-0">
                          <img
                            src="/dreamland-map.png"
                            alt="梦墟地图高清大图"
                            className="w-full h-auto rounded-lg shadow-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={downloadMap}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 shadow-inner">
                  <div
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] rounded-lg overflow-hidden shadow-lg"
                    onClick={() => document.querySelector("[data-dialog-trigger]")?.click()}
                  >
                    <img src="/dreamland-map.png" alt="梦墟地图" className="w-full h-auto rounded-lg" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="text-gray-800 font-medium flex items-center gap-2">
                          <Expand className="w-4 h-4" />
                          点击查看大图
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 路径详细信息显示 - 美化版 */}
                {path.length > 0 && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/20 backdrop-blur-sm">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg">
                      <Navigation className="w-5 h-5 text-blue-400" />
                      最优路径
                      <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-200 border-blue-400/30">
                        {path.length - 1} 步
                      </Badge>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {path.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/10 hover:bg-white/15 transition-all duration-200 group"
                        >
                          <Badge
                            variant={index === 0 ? "default" : index === path.length - 1 ? "destructive" : "secondary"}
                            className={`text-xs min-w-[28px] h-7 justify-center font-bold ${
                              index === 0
                                ? "bg-green-500 hover:bg-green-600 shadow-green-500/25 shadow-lg"
                                : index === path.length - 1
                                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/25 shadow-lg"
                                  : "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 shadow-lg"
                            }`}
                          >
                            {index + 1}
                          </Badge>
                          <span className="text-white text-sm font-medium flex-1">{location}</span>
                          {index < path.length - 1 && (
                            <span className="text-blue-300 text-lg ml-auto group-hover:translate-x-1 transition-transform duration-200">
                              →
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-blue-200 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        路径总览：从 <span className="text-green-300 font-semibold">{path[0]}</span> 到{" "}
                        <span className="text-red-300 font-semibold">{path[path.length - 1]}</span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
