import { Menu } from '@mui/icons-material'
import clsx from 'clsx'
import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Breadcrumbs, BreadcrumbsProps } from '../Breadcrumbs'
import { IconButton } from '../IconButton'
import { TopGradient } from '../TopGradient'
import { useAppLayoutContext } from './AppLayoutContext'

export interface PageHeaderProps {
  title?: string
  breadcrumbs?: BreadcrumbsProps
  className?: string
  noBorder?: boolean
  // Center title, breadcrumbs, or centerNode (whichever is displayed) even when
  // not responsive.
  forceCenter?: boolean
  centerNode?: ReactNode
  rightNode?: ReactNode
  gradient?: boolean
}

export const PAGE_HEADER_HEIGHT_CLASS_NAMES = 'h-20'

// Title and breadcrumbs are mutually exclusive. Title takes precedence.
export const PageHeader = ({
  title,
  breadcrumbs,
  className,
  noBorder = false,
  forceCenter = false,
  centerNode,
  rightNode,
  gradient,
}: PageHeaderProps) => {
  const { toggle } = useAppLayoutContext().responsiveNavigation

  // Intelligently move gradient to match scroll of page.
  const [scrollableScrollTop, setScrollableScrollTop] = useState(0)
  useEffect(() => {
    if (typeof document === 'undefined' || !gradient) {
      return
    }

    const gradientScrollElement = document.getElementById(
      'main-content-scrollable'
    )
    if (!gradientScrollElement) {
      return
    }

    // Prevent gradient from moving down on the page, happens during mobile
    // browser scroll bounce. Only allow negative offsets to hide gradient
    // upward as page is scrolled down.
    const onScroll = (event: Event) =>
      setScrollableScrollTop(
        Math.max((event.target as HTMLDivElement).scrollTop, 0)
      )

    gradientScrollElement.addEventListener('scroll', onScroll)
    return () => gradientScrollElement.removeEventListener('scroll', onScroll)
  }, [gradient])

  return (
    <div
      className={clsx('relative', PAGE_HEADER_HEIGHT_CLASS_NAMES, className)}
    >
      {gradient && (
        <TopGradient
          style={{
            top: -scrollableScrollTop,
          }}
        />
      )}

      <div
        className={clsx(
          'flex relative flex-row justify-center items-center w-full h-full',
          !forceCenter && 'sm:justify-start'
        )}
      >
        {title ? (
          <p className="leading-[5rem] header-text">{title}</p>
        ) : breadcrumbs ? (
          <Breadcrumbs {...breadcrumbs} />
        ) : (
          centerNode
        )}
      </div>

      {/* Place left and right components here below the center component so they take higher touch precedence over the Breadcrumbs container. */}
      <div className="flex absolute top-0 bottom-0 -left-2 flex-col justify-center">
        <IconButton
          Icon={Menu}
          className="!outline-none sm:hidden"
          onClick={toggle}
          variant="ghost"
        />
      </div>

      <div className="flex absolute top-0 right-0 bottom-0 flex-col justify-center">
        {rightNode}
      </div>

      {/* Use div for border so we can set absolute positioning and padding. */}
      {!noBorder && (
        <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-border-secondary"></div>
      )}
    </div>
  )
}

// This is a function that generates a function component, used in pages to
// render the page header. See the `makeRightSidebarContent` function comment in
// `RightSidebar.tsx` for more information on how this works.
export const makePageHeader = (container: HTMLDivElement | null) =>
  function PageHeaderPortal(props: PageHeaderProps) {
    return container ? createPortal(<PageHeader {...props} />, container) : null
  }