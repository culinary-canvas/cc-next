import { ArticleApi } from '../../article/Article.api'
import { GridPosition } from '../../article/grid/GridPosition'
import { Fit } from '../../article/shared/Fit'
import { Size } from '../../article/shared/format/Size'
import { SectionModel } from '../../article/section/Section.model'
import { ContentModel } from '../../article/content/ContentModel'
import { GridPositionService } from '../../article/grid/GridPosition.service'
import { ImageContentModel } from '../../article/content/image/ImageContent.model'
import { toJS } from 'mobx'

function setSectionGridPosition(s: SectionModel) {
  s.format.gridPosition = new GridPosition(
    s.format.fit === Fit.FULL_SCREEN || s.format.fit === Fit.SCREEN_WIDTH
      ? 1
      : 2,
    s.format.fit === Fit.FULL_SCREEN || s.format.fit === Fit.SCREEN_WIDTH
      ? 7
      : 6,
    s.sortOrder + 1,
    s.sortOrder + 2,
  )
}

function setSectionHeight(s: SectionModel) {
  s.format.height =
    s.format.fit === Fit.FULL_SCREEN ? Size.FULL_SCREEN : Size.FIT_CONTENT
}

function setContentGridPosition(s: SectionModel, i: number) {
  const content = s.contents[i]
  const oldColumn = s.columns.find((col) =>
    col.some((_c) => _c.uid === content.uid),
  )
  const oldColumnIndex =
    s.columns.findIndex((contents, i) =>
      contents.some((_c) => _c.uid === content.uid),
    ) + 1
  const oldColumnsCount = s.columns.length
  const oldColumnsMaxRowCount = s.columns.reduce(
    (max, rows) => (rows.length > max ? rows.length : max),
    0,
  )
  const oldColumnRowCount = oldColumn.length
  const rowIndex = oldColumn.findIndex((r) => r.uid === content.uid) + 1

  const startColumn =
    content instanceof ImageContentModel && content.format.background
      ? 1
      : oldColumnsCount > 2
      ? oldColumnIndex
      : oldColumnsCount === 2
      ? oldColumnIndex > 1
        ? 3
        : 1
      : 1

  const endColumn =
    content instanceof ImageContentModel && content.format.background
      ? 5
      : oldColumnsCount > 2
      ? oldColumnIndex + 1
      : oldColumnsCount === 2
      ? oldColumnIndex > 1
        ? 5
        : 3
      : 5

  const startRow = rowIndex
  const endRow =
    content instanceof ImageContentModel && content.format.background
      ? oldColumnsMaxRowCount + 1
      : oldColumnsMaxRowCount === 1
      ? 2
      : oldColumnRowCount === 1
      ? oldColumnsMaxRowCount + 1
      : rowIndex + 1

  content.format.gridPosition = new GridPosition(
    startColumn,
    endColumn,
    startRow,
    endRow,
  )
}

function setContentLayers(contents: ContentModel[]) {
  if (
    contents.some((c) => c instanceof ImageContentModel && c.format.background)
  ) {
    contents.forEach((c) =>
      GridPositionService.autoSetLayersInPosition(
        contents,
        c.format.gridPosition,
      ),
    )

    contents
      .filter((c) => c instanceof ImageContentModel && c.format.background)
      .reverse()
      .forEach((c) => GridPositionService.layerDown(c, contents))
  }
}

export async function transformToGridPositions(userId: string) {
  const articles = await ArticleApi.all()
  articles.forEach((a) => {
    console.group(a.title)
    a.sections.forEach((s) => {
      console.log(`Transforming section ${s.displayName}...`, toJS(s))
      setSectionGridPosition(s)
      setSectionHeight(s)
      console.log(`Done`, toJS(s))

      for (let i = 0; i < s.contents.length; i++) {
        const c = s.contents[i]
        console.log(`Transforming content ${c.displayName}...`, toJS(c))
        setContentGridPosition(s, i)
        console.log(`Section ${s.displayName} done`, toJS(c))
      }
      console.log(`Setting content layers...`, toJS(s))
      setContentLayers(s.contents)
      console.log(`Done!`, toJS(s))
    })
    console.groupEnd()
  })
  return Promise.all(
    articles.map(async (a) => await ArticleApi.save(a, userId)),
  )
}
