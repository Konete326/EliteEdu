import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { HEADER_BG_PRESETS } from '../../utils/themeConstants';
import { getNavCategories } from '../../config/adminNavConfig';
import SidebarAccordion from './SidebarAccordion';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ mobileOpen, setMobileOpen, isDesktopOpen, setIsDesktopOpen, isDark, toggleTheme, onLogoutClick }) => {
  const { user } = useAuth();
  const { themeSettings } = useTheme();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState('Main');
  const [searchQuery, setSearchQuery] = useState('');

  const activePreset = HEADER_BG_PRESETS.find((p) => p.id === themeSettings.headerBg);
  const isColored = themeSettings.headerBg && themeSettings.headerBg !== 'white';
  const sidebarBgClass = isColored && activePreset ? activePreset.sidebarClass : isDark ? 'bg-surface-dark border-r border-line-dark text-ink-dark' : 'bg-surface border-r border-line text-ink';
  const headerBorderClass = isColored ? 'border-white/15' : 'border-line dark:border-line-dark';
  const brandTextClass = isColored ? 'text-white' : 'text-ink dark:text-ink-dark';
  const allCategories = getNavCategories(user);

  useEffect(() => {
    if (!user || searchQuery.trim()) return;
    const active = allCategories.find((cat) => cat.subItems?.some((sub) => sub.path === location.pathname));
    if (active) setOpenGroup(active.title);
  }, [location.pathname, user]);

  const filteredCategories = !searchQuery.trim() ? allCategories : allCategories.map((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (cat.title.toLowerCase().includes(q)) return cat;
    const matched = cat.subItems?.filter((s) => s.name.toLowerCase().includes(q)) || [];
    return matched.length ? { ...cat, subItems: matched } : null;
  }).filter(Boolean);

  const toggleGroup = (title) => setOpenGroup((prev) => (prev === title ? null : title));

  const navBody = (isExpanded) => (
    <div className={`flex flex-col h-full ${sidebarBgClass} transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className={`flex items-center justify-between h-16 px-4 border-b ${headerBorderClass} shrink-0 overflow-hidden`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="Elite Edu" className="w-8 h-8 object-contain shrink-0 drop-shadow-sm" />
          {isExpanded && <span className={`font-extrabold text-base tracking-tight truncate ${brandTextClass}`}>Elite Edu</span>}
        </div>
        {isExpanded && mobileOpen && (
          <button type="button" onClick={() => setMobileOpen(false)} className={`lg:hidden ${isColored ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink'}`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isColored ? 'text-white/70' : 'text-ink-muted'}`} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
                isColored
                  ? 'bg-white/15 border-white/20 text-white placeholder:text-white/60 focus:ring-white/40'
                  : 'bg-surface-secondary dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:ring-primary'
              }`}
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {filteredCategories.map((cat, idx) => (
          <SidebarAccordion
            key={cat.title || idx}
            category={cat}
            isOpen={searchQuery.trim() ? true : openGroup === cat.title}
            onToggle={toggleGroup}
            isExpanded={isExpanded}
            onNavigate={() => setMobileOpen(false)}
            isColored={isColored}
          />
        ))}
      </nav>

      <SidebarFooter
        user={user}
        isExpanded={isExpanded}
        onToggleCollapse={() => (window.innerWidth >= 1024 ? setIsDesktopOpen((p) => !p) : setMobileOpen(false))}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogoutClick={onLogoutClick}
        isColored={isColored}
      />
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex shrink-0 h-full transition-all duration-300 ${isDesktopOpen ? 'w-64' : 'w-16'}`}>
        {navBody(isDesktopOpen)}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">{navBody(true)}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
