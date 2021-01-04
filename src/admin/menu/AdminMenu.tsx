import React, { useRef } from 'react'
import s from './AdminMenu.module.scss'
import Link from 'next/link'
import { classnames } from '../../services/importHelpers'
import { COLOR } from '../../styles/_color'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

interface Props {
  className?: string
  linkClassName?: string
}

export function AdminMenu({ className, linkClassName }: Props) {
  const router = useRouter()

  const linkVariants = useRef({
    initial: { color: COLOR.BLUE_LIGHT },
    hovered: { color: COLOR.BLUE },
  }).current

  const bottomBorderVariants = useRef({
    initial: { width: 0, backgroundColor: 'transparent' },
    hovered: { width: '100%', backgroundColor: COLOR.BLUE },
  }).current

  return (
    <div className={classnames(s.container, className)}>
      <Link href="/admin/articles">
        <motion.span
          variants={linkVariants}
          initial={
            router.pathname.includes('/admin/articles') ? 'hovered' : 'initial'
          }
          whileHover="hovered"
          className={classnames(s.link, linkClassName)}
        >
          Articles
          <motion.span
            initial={
              router.pathname.includes('/admin/articles')
                ? 'hovered'
                : 'initial'
            }
            variants={bottomBorderVariants}
            className={s.linkBottomBorder}
          />
        </motion.span>
      </Link>

      <Link href="/admin/companies">
        <motion.span
          variants={linkVariants}
          initial={
            router.pathname.includes('/admin/companies') ? 'hovered' : 'initial'
          }
          whileHover="hovered"
          className={classnames(s.link, linkClassName)}
        >
          Companies
          <motion.span
            initial={
              router.pathname.includes('/admin/companies')
                ? 'hovered'
                : 'initial'
            }
            variants={bottomBorderVariants}
            className={s.linkBottomBorder}
          />
        </motion.span>
      </Link>

      <Link href="/admin/persons">
        <motion.span
          variants={linkVariants}
          initial={
            router.pathname.includes('/admin/persons') ? 'hovered' : 'initial'
          }
          whileHover="hovered"
          className={classnames(s.link, linkClassName)}
        >
          Persons
          <motion.span
            initial={
              router.pathname.includes('/admin/persons') ? 'hovered' : 'initial'
            }
            variants={bottomBorderVariants}
            className={s.linkBottomBorder}
          />
        </motion.span>
      </Link>
    </div>
  )
}
