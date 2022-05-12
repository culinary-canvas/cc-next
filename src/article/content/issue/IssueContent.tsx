import { motion } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import React, { CSSProperties, useState } from 'react'
import { useAdmin } from '../../../admin/Admin.context'
import { useAutorun } from '../../../hooks/useAutorun'
import { IssueDisplay } from '../../../issue/issueDisplay/IssueDisplay'
import { classnames } from '../../../services/importHelpers'
import { GridPositionService } from '../../grid/GridPosition.service'
import { ArticleModel } from '../../models/Article.model'
import { IssueContentModel } from '../../models/IssueContent.model'
import s from './IssueContent.module.scss'

interface Props {
  article: ArticleModel
  content: IssueContentModel
}

export const IssueContent = observer((props: Props) => {
  const { article, content } = props

  const [formatStyle, setFormatStyle] = useState<CSSProperties>({})
  const [formatClassNames, setFormatClassNames] = useState<string>('')
  const admin = useAdmin()

  useAutorun(() => {
    const { format } = content
    const gridCss = GridPositionService.gridPositionAsCss(
      content.format.gridPosition,
    )

    setFormatStyle({
      backgroundColor: format.backgroundColor,
      marginTop: `${format.padding.top}px`,
      marginBottom: `${format.padding.bottom}px`,
      marginLeft: `${format.padding.left}px`,
      marginRight: `${format.padding.right}px`,
      ...gridCss,
    })
  }, [content.format])

  useAutorun(() => {
    setFormatClassNames(
      classnames([
        s.content,
        s[`horizontal-align-${content.format.horizontalAlign}`],
        s[`vertical-align-${content.format.verticalAlign}`],
        s[`content-type-${content.type}`],
      ]),
    )
  }, [content.type, content.format])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={formatClassNames}
      style={formatStyle}
      onClick={() => admin.setContent(content)}
    >
      <IssueDisplay issue={article.issue} />
    </motion.div>
  )
})
