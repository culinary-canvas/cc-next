import { observer } from 'mobx-react-lite'
import React from 'react'
import { useAdmin } from '../../../admin/Admin.context'
import { IssueContent } from '../../content/issue/IssueContent'
import { TextContent } from '../../content/text/TextContent'
import { ArticleModel } from '../../models/Article.model'
import { ContentModel } from '../../models/ContentModel'
import { ImageContentModel } from '../../models/ImageContent.model'
import { IssueContentModel } from '../../models/IssueContent.model'
import { SectionModel } from '../../models/Section.model'
import { TextContentModel } from '../../models/TextContent.model'
import { ImageContentEdit } from '../image/ImageContentEdit'
import { TextContentEdit } from '../text/TextContentEdit'

interface Props {
  content: ContentModel
  article: ArticleModel
  section: SectionModel
  first: boolean
  index: number
}

export const ContentEdit = observer((props: Props) => {
  const admin = useAdmin()
  const { content, article, section, first, index } = props

  // if (section.format.gridPosition.startRow === 2) {
  //   console.log(section)
  //   console.log(content)
  // }
  //
  return content instanceof TextContentModel ? (
    admin.content?.uid === content.uid ? (
      <TextContentEdit key={content.uid} content={content} />
    ) : (
      <TextContent
        article={article}
        key={content.uid}
        content={content}
        onClick={() => admin.setContent(content)}
        index={index}
      />
    )
  ) : content instanceof IssueContentModel ? (
    <IssueContent key={content.uid} content={content} article={article} />
  ) : (
    <ImageContentEdit
      key={content.uid}
      content={content as ImageContentModel}
      section={section}
      first={first}
    />
  )
})
