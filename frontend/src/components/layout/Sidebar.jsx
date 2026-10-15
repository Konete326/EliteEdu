import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getNavCategories } from '../../config/adminNavConfig';
import SidebarAccordion from './SidebarAccordion';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ mobileOpen, setMobileOpen, isDesktopOpen, setIsDesktopOpen, isDark, toggleTheme, onLogoutClick }) => {
  const { user } = useAuth();
  const { themeSettings } = useTheme();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState('Main');
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkSidebar = themeSettings?.sidebarBg === 'dark' || isDark;

  const allCategories = getNavCategories(user);

  useEffect(() => {
    if (!user || searchQuery.trim()) return;
    const active = allCategories.find((cat) => cat.subItems?.some((sub) => sub.path === location.pathname));
    if (active) setOpenGroup(active.title);
  }, [location.pathname, user]);

  const filteredCategories = !searchQuery.trim()
    ? allCategories
    : allCategories.map((cat) => {
        const titleMatch = cat.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchedSubs = cat.subItems?.filter((sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) || [];
        if (titleMatch) return cat;
        if (matchedSubs.length > 0) return { ...cat, subItems: matchedSubs };
        return null;
      }).filter(Boolean);

  const toggleGroup = (title) => setOpenGroup((prev) => (prev === title ? null : title));

  const navBody = (isExpanded) => (
    <div className={`flex flex-col h-full ${isDarkSidebar ? 'bg-[#0c0c0f] border-r border-[#272730] text-white' : 'bg-surface dark:bg-surface-dark border-r border-line dark:border-line-dark text-ink dark:text-ink-dark'} transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <div className={`flex items-center justify-between h-16 px-4 border-b ${isDarkSidebar ? 'border-[#272730]' : 'border-line dark:border-line-dark'} shrink-0 overflow-hidden`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/logo.png" alt="Elite Edu" className="w-8 h-8 object-contain shrink-0 drop-shadow-sm" />
          {isExpanded && (
            <span className="font-extrabold text-base tracking-tight text-ink dark:text-ink-dark truncate">
              Elite Edu
            </span>
          )}
        </div>
        {isExpanded && mobileOpen && (
          <button type="button" onClick={() => setMobileOpen(false)} className="lg:hidden text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary"
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
          />
        ))}
      </nav>

      <SidebarFooter
        user={user}
        isExpanded={isExpanded}
        onToggleCollapse={() => {
          if (window.innerWidth >= 1024) setIsDesktopOpen((prev) => !prev);
          else setMobileOpen(false);
        }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogoutClick={onLogoutClick}
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
