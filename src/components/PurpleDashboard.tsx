import React, { useState, useEffect } from 'react'
import { 
  // Clock, 
  CheckCircle, 
  Circle, 
  Cloud, 
  Brain, 
  Heart, 
  Star,
  Calendar,
  TrendingUp,
  Zap,
  BookOpen,
  Target
} from 'lucide-react'

interface Task {
  id: string
  text: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
}

interface KnowledgeItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

export const PurpleDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review analytics', completed: true, priority: 'high' },
    { id: '2', text: 'Meta Goals', completed: false, priority: 'medium' },
    { id: '3', text: 'Meditate', completed: false, priority: 'low' },
    { id: '4', text: 'Journal', completed: false, priority: 'medium' },
    { id: '5', text: 'SSL Cert', completed: false, priority: 'high' },
    { id: '6', text: 'Deploy app', completed: false, priority: 'high' },
    { id: '7', text: 'Call mom', completed: false, priority: 'low' },
    { id: '8', text: 'Study React', completed: false, priority: 'medium' },
    { id: '9', text: 'Gym', completed: false, priority: 'low' }
  ])

  const [knowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      title: 'Student Life',
      description: 'Leverage my flaws and imperfections',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Permanent Knowledge',
      description: 'Core learning that shapes my way',
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Embrace joy and happiness',
      description: 'Focus on positive mental states',
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: '4',
      title: 'The universe has good things in store for me',
      description: 'Maintain optimistic outlook',
      icon: <Star className="h-4 w-4" />
    }
  ])

  const progressData = [
    { label: 'Sleep', value: 85, color: 'bg-purple-500' },
    { label: 'Exercise', value: 62, color: 'bg-violet-500' },
    { label: 'Mindful', value: 78, color: 'bg-indigo-500' },
    { label: 'Study', value: 91, color: 'bg-purple-400' }
  ]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-purple-200">Welcome, Angelina • 9 • 7 • 6</p>
          </div>
          <div className="text-right">
            <div className="text-purple-300 text-sm">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-purple-200 text-xs mt-1">
              ✨ Powered and loading data... ✨
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Time Display */}
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {String(currentTime.getHours()).padStart(2, '0')}
                </div>
                <div className="text-purple-300 text-lg">HR</div>
                <div className="text-6xl font-bold text-white mb-2 mt-4">
                  {String(currentTime.getMinutes()).padStart(2, '0')}
                </div>
                <div className="text-purple-300 text-lg">MINS</div>
              </div>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="lg:col-span-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Daily Tasks
                </h2>
                <div className="text-purple-300 text-sm">
                  {completedTasks}/{totalTasks}
                </div>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm flex-1 ${
                      task.completed ? 'text-gray-400 line-through' : 'text-white'
                    }`}>
                      {task.text}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="lg:col-span-5">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 h-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Progress
              </h2>
              <div className="space-y-6">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">{item.label}</span>
                      <span className="text-purple-300 text-sm">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="lg:col-span-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <div className="text-center">
                <h3 className="text-white font-bold mb-2">SYDNEY</h3>
                <p className="text-purple-300 text-sm mb-4">AUSTRALIA</p>
                <Cloud className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-4xl font-bold text-white">13°C</div>
                <p className="text-purple-300 text-sm mt-2">light rain</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="aspect-square bg-gradient-to-br from-purple-600 to-violet-800 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Purple Cards */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item}
                  className="aspect-square bg-gradient-to-br from-purple-500 to-violet-700 rounded-xl p-3 flex items-center justify-center"
                >
                  <Zap className="h-8 w-8 text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Section */}
          <div className="lg:col-span-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Knowledge
              </h2>
              <div className="space-y-4">
                {knowledgeItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-500/10 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{item.title}</h3>
                      <p className="text-purple-300 text-xs mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* More Purple Gallery */}
          <div className="lg:col-span-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="aspect-square bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
                  >
                    <Target className="h-6 w-6 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quote Footer */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm italic">
            "You must be the change you wish to see in the world." | "Darkness cannot drive out darkness; only light can do that." | "The future belongs to those who believe in the beauty of their dreams."
          </p>
        </div>
      </div>
    </div>
  )
}