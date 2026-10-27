import { useState, useEffect, useMemo, useCallback, memo } from 'react';
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

  const activePreset = useMemo(
    () => HEADER_BG_PRESETS.find((p) => p.id === themeSettings.headerBg),
    [themeSettings.headerBg]
  );
  const isColored = Boolean(themeSettings.headerBg && themeSettings.headerBg !== 'white');
  const sidebarBgClass = isColored && activePreset ? activePreset.sidebarClass : isDark ? 'bg-surface-dark border-r border-line-dark text-ink-dark' : 'bg-surface border-r border-line text-ink';
  const headerBorderClass = isColored ? 'border-white/15' : 'border-line dark:border-line-dark';
  const brandTextClass = isColored ? 'text-white' : 'text-ink dark:text-ink-dark';

  const allCategories = useMemo(() => getNavCategories(user), [user]);

  useEffect(() => {
    if (!user || searchQuery.trim()) return;
    const active = allCategories.find((cat) => cat.subItems?.some((sub) => sub.path === location.pathname));
    if (active) setOpenGroup(active.title);
  }, [location.pathname, user, allCategories, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return allCategories;
    const q = searchQuery.toLowerCase().trim();
    return allCategories.map((cat) => {
      if (cat.title.toLowerCase().includes(q)) return cat;
      const matched = cat.subItems?.filter((s) => s.name.toLowerCase().includes(q)) || [];
      return matched.length ? { ...cat, subItems: matched } : null;
    }).filter(Boolean);
  }, [allCategories, searchQuery]);

  const toggleGroup = useCallback((title) => {
    if (!isDesktopOpen) setIsDesktopOpen(true);
    setOpenGroup((prev) => (!isDesktopOpen || prev !== title ? title : null));
  }, [isDesktopOpen, setIsDesktopOpen]);

  const handleCloseMobile = useCallback(() => setMobileOpen(false), [setMobileOpen]);
  const handleToggleCollapse = useCallback(() => {
    if (window.innerWidth >= 1024) setIsDesktopOpen((p) => !p);
    else setMobileOpen(false);
  }, [setIsDesktopOpen, setMobileOpen]);

  const navBody = (isExpanded) => (
    <div className={`flex flex-col h-full ${sidebarBgClass} transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className={`flex items-center justify-between h-16 px-4 border-b ${headerBorderClass} shrink-0 overflow-hidden`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="Elite Edu" className="w-8 h-8 object-contain shrink-0 drop-shadow-sm" />
          {isExpanded && <span className={`font-extrabold text-base tracking-tight truncate ${brandTextClass}`}>Elite Edu</span>}
        </div>
        {isExpanded && mobileOpen && (
          <button type="button" onClick={handleCloseMobile} className={`lg:hidden ${isColored ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink'}`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isColored ? 'text-white/70' : 'text-ink-muted'}`} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border transition-colors focus:outline-none focus:ring-1 ${
                isColored
                  ? 'bg-white/15 border-white/20 text-white placeholder:text-white/60 focus:ring-white/40'
                  : 'bg-surface-secondary dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:ring-primary'
              }`}
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto overflow-x-hidden sidebar-scrollbar">
        {filteredCategories.map((cat, idx) => (
          <SidebarAccordion
            key={cat.title || idx}
            category={cat}
            isOpen={searchQuery.trim() ? true : openGroup === cat.title}
            onToggle={toggleGroup}
            isExpanded={isExpanded}
            onNavigate={handleCloseMobile}
            isColored={isColored}
          />
        ))}
      </nav>

      <SidebarFooter
        user={user}
        isExpanded={isExpanded}
        onToggleCollapse={handleToggleCollapse}
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseMobile} />
          <div className="relative z-10 h-full">{navBody(true)}</div>
        </div>
      )}
    </>
  );
};

export default memo(Sidebar);
