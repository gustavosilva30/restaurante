"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  ChefHat,
  Truck,
  QrCode,
  Package,
  Factory,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Bell,
  Search,
  Plus,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
  HelpCircle,
  MessageSquare,
  Command,
  MapPin,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "PDV", href: "/pdv", icon: ShoppingCart, badge: null, highlight: true },
  { name: "Mesas", href: "/mesas", icon: UtensilsCrossed, badge: 8, badgeType: "warning" as const },
  { name: "Cozinha", href: "/cozinha", icon: ChefHat, badge: 5, badgeType: "destructive" as const },
  { name: "KFS Cozinha/Salão", href: "/kfs", icon: Zap, badge: "Novo", badgeType: "info" as const },
  { name: "Delivery", href: "/delivery", icon: Truck, badge: 12, badgeType: "info" as const },
  { name: "Atendimento", href: "/atendimento", icon: MessageSquare, badge: 1, badgeType: "info" as const },
  { name: "Cardápio", href: "/cardapio", icon: QrCode, badge: null },
  { name: "Estoque", href: "/estoque", icon: Package, badge: 3, badgeType: "warning" as const },
  { name: "Produção", href: "/producao", icon: Factory, badge: null },
  { name: "Financeiro", href: "/financeiro", icon: Wallet, badge: null },
]

const secondaryNavigation = [
  { name: "Painel Admin", href: "/admin", icon: Shield },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

const units = [
  { id: "1", name: "Sabor & Arte", location: "Centro - SP", logo: null, isActive: true },
  { id: "2", name: "Sabor & Arte", location: "Pinheiros - SP", logo: null, isActive: false },
  { id: "3", name: "Sabor & Arte", location: "Moema - SP", logo: null, isActive: false },
]

const notifications = [
  { id: "1", title: "Estoque baixo", description: "Tomate cereja abaixo do mínimo", time: "2min", type: "warning" },
  { id: "2", title: "Novo pedido delivery", description: "Pedido #1847 aguardando", time: "5min", type: "info" },
  { id: "3", title: "Mesa 12 solicitando", description: "Cliente pediu a conta", time: "8min", type: "default" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  const [selectedUnit, setSelectedUnit] = React.useState(units[0])
  const [unreadNotifications, setUnreadNotifications] = React.useState(3)

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 72 },
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 },
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col",
          "border-r border-sidebar-border/50",
          "bg-sidebar/80 backdrop-blur-xl",
          "supports-[backdrop-filter]:bg-sidebar/60"
        )}
      >
        {/* Header with Company Selector */}
        <div className="flex h-14 items-center border-b border-sidebar-border/50 px-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-10 gap-2 px-2 hover:bg-sidebar-accent/80 transition-all duration-200",
                  collapsed ? "w-10 justify-center" : "w-full justify-start"
                )}
              >
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/20">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-primary-foreground" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-sidebar bg-success" />
                </div>
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.div
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={itemVariants}
                      transition={{ duration: 0.15 }}
                      className="flex flex-1 flex-col items-start overflow-hidden"
                    >
                      <span className="truncate text-sm font-semibold text-sidebar-foreground">
                        {selectedUnit.name}
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        {selectedUnit.location}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!collapsed && (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-72 p-2"
              sideOffset={8}
            >
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                Suas unidades
              </DropdownMenuLabel>
              {units.map((unit) => (
                <DropdownMenuItem
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{unit.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {unit.location}
                    </p>
                  </div>
                  {selectedUnit.id === unit.id && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Adicionar unidade</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 border-b border-sidebar-border/50 px-3 py-2">
          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/80"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
              <span>Buscar</span>
              <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                <Command className="h-3 w-3" />K
              </kbd>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/80"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                          {unreadNotifications}
                        </span>
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notificações</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start" className="w-80 p-0" sideOffset={8}>
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h4 className="text-sm font-semibold">Notificações</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setUnreadNotifications(0)}
                >
                  Marcar como lidas
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                  >
                    <div className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      notification.type === "warning" && "bg-warning/10 text-warning",
                      notification.type === "info" && "bg-info/10 text-info",
                      notification.type === "default" && "bg-muted text-muted-foreground"
                    )}>
                      {notification.type === "warning" && <Package className="h-4 w-4" />}
                      {notification.type === "info" && <Truck className="h-4 w-4" />}
                      {notification.type === "default" && <MessageSquare className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{notification.time}</span>
                  </div>
                ))}
              </div>
              <div className="border-t p-2">
                <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">
                  Ver todas as notificações
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Order Shortcut */}
          {!collapsed && (
            <Link href="/pdv" className="flex-1">
              <Button
                size="sm"
                className="w-full h-8 gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none"
              >
                <Zap className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Novo Pedido</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              const NavLink = (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    "transition-all duration-200 ease-out",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-0"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon with glow effect for active */}
                  <div className={cn(
                    "relative flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200",
                    "group-hover:scale-110",
                    isActive && "text-primary"
                  )}>
                    <item.icon className="h-[18px] w-[18px]" />
                    {isActive && (
                      <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
                    )}
                  </div>

                  {/* Label */}
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        transition={{ duration: 0.15 }}
                        className="flex-1 truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {item.badge && !collapsed && (
                    <Badge
                      variant={item.badgeType === "destructive" ? "destructive" : "secondary"}
                      className={cn(
                        "h-5 min-w-5 justify-center px-1.5 text-[10px] font-semibold",
                        item.badgeType === "warning" && "bg-warning/15 text-warning border-warning/30",
                        item.badgeType === "info" && "bg-info/15 text-info border-info/30",
                        item.badgeType === "destructive" && "bg-destructive/15 text-destructive border-destructive/30"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}

                  {/* Collapsed badge dot */}
                  {item.badge && collapsed && (
                    <span className={cn(
                      "absolute right-2 top-2 h-2 w-2 rounded-full",
                      item.badgeType === "warning" && "bg-warning",
                      item.badgeType === "info" && "bg-info",
                      item.badgeType === "destructive" && "bg-destructive animate-pulse"
                    )} />
                  )}

                  {/* Highlight indicator (new feature) */}
                  {item.highlight && !collapsed && (
                    <Sparkles className="h-3 w-3 text-warning animate-pulse" />
                  )}
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12} className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 min-w-5 justify-center px-1.5 text-[10px]",
                            item.badgeType === "warning" && "bg-warning/15 text-warning",
                            item.badgeType === "info" && "bg-info/15 text-info",
                            item.badgeType === "destructive" && "bg-destructive/15 text-destructive"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return NavLink
            })}
          </div>

          {/* Secondary Navigation */}
          <div className="mt-6 pt-4 border-t border-sidebar-border/50">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Sistema
              </p>
            )}
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href
                const NavLink = (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive && "text-primary"
                    )} />
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={itemVariants}
                          transition={{ duration: 0.15 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>{NavLink}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={12}>
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return NavLink
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border/50 p-3 space-y-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-9 gap-3 text-muted-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                      "transition-all duration-200",
                      collapsed ? "w-9 justify-center px-0" : "w-full justify-start px-3"
                    )}
                  >
                    <div className="relative">
                      {!mounted ? (
                        <Monitor className="h-[18px] w-[18px]" />
                      ) : theme === "dark" ? (
                        <Moon className="h-[18px] w-[18px]" />
                      ) : theme === "light" ? (
                        <Sun className="h-[18px] w-[18px]" />
                      ) : (
                        <Monitor className="h-[18px] w-[18px]" />
                      )}
                    </div>
                    {!collapsed && (
                      <motion.span
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        className="text-sm"
                      >
                        {!mounted ? "Sistema" : theme === "dark" ? "Escuro" : theme === "light" ? "Claro" : "Sistema"}
                      </motion.span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Tema</TooltipContent>}
            </Tooltip>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-40">
              <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                <Sun className="h-4 w-4" />
                Claro
                {theme === "light" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                <Moon className="h-4 w-4" />
                Escuro
                {theme === "dark" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                <Monitor className="h-4 w-4" />
                Sistema
                {theme === "system" && <Check className="h-4 w-4 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 gap-3 text-muted-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-foreground",
                  "transition-all duration-200",
                  collapsed ? "w-9 justify-center px-0" : "w-full justify-start px-3"
                )}
              >
                <HelpCircle className="h-[18px] w-[18px]" />
                {!collapsed && <span className="text-sm">Ajuda</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Ajuda</TooltipContent>}
          </Tooltip>

          {/* User Profile */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-11 gap-3 hover:bg-sidebar-accent/80",
                      "transition-all duration-200",
                      collapsed ? "w-11 justify-center px-0" : "w-full justify-start px-2"
                    )}
                  >
                    <Avatar className="h-7 w-7 shrink-0 border border-sidebar-border">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                      <motion.div
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={itemVariants}
                        className="flex flex-col items-start overflow-hidden"
                      >
                        <span className="text-sm font-medium text-sidebar-foreground truncate">
                          João da Silva
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">
                          Gerente
                        </span>
                      </motion.div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={12}>
                  João da Silva
                </TooltipContent>
              )}
            </Tooltip>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
              <div className="flex items-center gap-3 p-3 border-b">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate">João da Silva</span>
                  <span className="text-xs text-muted-foreground truncate">joao@saborearte.com</span>
                </div>
              </div>
              <div className="p-1">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Minha conta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Collapse Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className={cn(
                  "h-8 w-full text-muted-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  "transition-all duration-200"
                )}
              >
                <motion.div
                  animate={{ rotate: collapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expandir menu" : "Recolher menu"}
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
