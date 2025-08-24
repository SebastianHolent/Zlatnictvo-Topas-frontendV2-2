'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ShopNavigation({ parentCategories, allCategories }) {
  const [hoveredParent, setHoveredParent] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileParent, setExpandedMobileParent] = useState(null);
  const [isDesktop, setIsDesktop] = useState(true);

  const getChildren = (parentId) =>
    allCategories.filter((cat) => cat.parent_category_id === parentId);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="relative bg-gray-100 z-50 text-gray-600"
      onMouseLeave={() => setHoveredParent(null)}
    >
      {/* mobilham */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <Link href="/e-shop" className="font-bold text-xl">E-shop</Link>
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="text-2xl"
        >
          {mobileOpen ? '−' : '+'}
        </button>
      </div>

      {/* pocitacnav */}
      <ul className="hidden lg:flex flex-row gap-6 p-4">
        <Link href="/e-shop" className="font-medium hover:underline cursor-pointer text-lg text-gray-600">E-shop</Link>
        {parentCategories.map((parentCategory) => {
          const childCategories = getChildren(parentCategory.id);
          const hasChildren = childCategories.length > 0;

          return (
            <li
              key={parentCategory.id}
              className="relative"
              onMouseEnter={() =>
                hasChildren ? setHoveredParent(parentCategory.id) : setHoveredParent(null)
              }
            >
              <Link
                href={`/e-shop/${parentCategory.handle}`}
                className="font-medium hover:underline cursor-pointer text-lg text-gray-600"
              >
                {parentCategory.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* pocitacdropdown */}
      {isDesktop && hoveredParent && getChildren(hoveredParent).length > 0 && (
        <div className="absolute left-0 top-full w-screen bg-gray-200 py-4 px-4 shadow-md hidden lg:block text-gray-600">
          <ul className="flex flex-row gap-6">            
            {getChildren(hoveredParent).map((child) => (
              <li key={child.id}>
                <Link
                  href={`/e-shop/${parentCategories.find(p => p.id === hoveredParent)?.handle}/${child.handle}`}
                  className="hover:underline text-base"
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* mobilnenav */}
      {mobileOpen && (
        <div className="block lg:hidden border-t-3 border-gray-300 px-4 pb-4">
          <ul className="flex flex-col gap-4 mt-4">
            {parentCategories.map((parentCategory) => {
              const childCategories = getChildren(parentCategory.id);
              const hasChildren = childCategories.length > 0;
              const isExpanded = expandedMobileParent === parentCategory.id;

              return (
                <li key={parentCategory.id}>
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() =>
                      hasChildren
                        ? setExpandedMobileParent(
                            isExpanded ? null : parentCategory.id
                          )
                        : null
                    }
                  >
                    <Link
                      href={`/e-shop/${parentCategory.handle}`}
                      className="font-bold text-lg"
                    >
                      {parentCategory.name}
                    </Link>
                    {hasChildren && (
                      <span className="text-xl">{isExpanded ? '−' : '+'}</span>
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="pl-4 mt-2 flex flex-col gap-2 bg-gray-100 p-2 rounded">
                      {childCategories.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/e-shop/${parentCategory.handle}/${child.handle}`}
                            className="text-base hover:underline"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
