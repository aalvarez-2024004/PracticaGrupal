import ExcelJS from 'exceljs'

const EMERALD = 'FF059669'
const EMERALD_SOFT = 'FFD1FAE5'
const DARK = 'FF0F172A'
const WHITE = 'FFFFFFFF'
const GRAY_LIGHT = 'FFF8FAFC'
const GRAY_MID = 'FFE2E8F0'
const GRAY_TEXT = 'FF64748B'
const AMBER = 'FFD97706'
const RED = 'FFDC2626'
const moneyFmt = '"Q" #,##0.00'

const addSheetHeader = (worksheet, subtitle, columnCount) => {
  const lastCol = String.fromCharCode(64 + columnCount)

  worksheet.mergeCells(`A1:${lastCol}1`)
  const titleCell = worksheet.getCell('A1')
  titleCell.value = 'SISTEMA DE GESTIÓN DE INVENTARIO'
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: WHITE } }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(1).height = 38

  worksheet.mergeCells(`A2:${lastCol}2`)
  const subCell = worksheet.getCell('A2')
  subCell.value = subtitle.toUpperCase()
  subCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: WHITE } }
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EMERALD } }
  subCell.alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(2).height = 24

  worksheet.mergeCells(`A3:${lastCol}3`)
  const dateCell = worksheet.getCell('A3')
  dateCell.value = `Generado el ${new Date().toLocaleDateString('es-GT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })}`
  dateCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: GRAY_TEXT } }
  dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRAY_LIGHT } }
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' }
  worksheet.getRow(3).height = 18
  worksheet.getRow(4).height = 8

  return 5
}

const addTableHeaders = (worksheet, rowNum, headers) => {
  const row = worksheet.getRow(rowNum)
  row.height = 28
  headers.forEach((header, i) => {
    const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}${rowNum}`)
    cell.value = header
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: WHITE } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EMERALD } }
    cell.alignment = { horizontal: i === 0 ? 'left' : 'center', vertical: 'middle' }
  })
}

const addDataRow = (worksheet, rowNum, values, index, moneyColumns = []) => {
  const bgColor = index % 2 === 0 ? WHITE : GRAY_LIGHT
  worksheet.getRow(rowNum).height = 20
  values.forEach((value, i) => {
    const cell = worksheet.getCell(`${String.fromCharCode(65 + i)}${rowNum}`)
    cell.value = value
    cell.font = { name: 'Calibri', size: 10, color: { argb: DARK } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
    cell.alignment = { horizontal: i === 0 ? 'left' : 'center', vertical: 'middle' }
    cell.border = {
      top: { style: 'hair', color: { argb: GRAY_MID } },
      bottom: { style: 'hair', color: { argb: GRAY_MID } },
      left: { style: 'hair', color: { argb: GRAY_MID } },
      right: { style: 'hair', color: { argb: GRAY_MID } }
    }
    if (moneyColumns.includes(i)) {
      cell.numFmt = moneyFmt
      cell.alignment = { horizontal: 'right', vertical: 'middle' }
    }
  })
}

export const buildInventoryExcel = async ({ productos, categorias, movimientos, threshold }) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Sistema de Gestión de Inventario'
  workbook.created = new Date()

  const sheetOptions = {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
    views: [{ showGridLines: false }]
  }

  const summarySheet = workbook.addWorksheet('Resumen', sheetOptions)
  summarySheet.columns = [{ width: 40 }, { width: 26 }]
  let rowNum = addSheetHeader(summarySheet, 'Reporte general del inventario', 2)

  const totalStock = productos.reduce((sum, p) => sum + p.existencia, 0)
  const inventoryValue = productos.reduce((sum, p) => sum + p.existencia * p.precio, 0)
  const lowStock = productos.filter((p) => p.existencia > 0 && p.existencia <= threshold)
  const outOfStock = productos.filter((p) => p.existencia === 0)
  const entradas = movimientos.filter((m) => m.tipo === 'ENTRADA')
  const salidas = movimientos.filter((m) => m.tipo === 'SALIDA')

  addTableHeaders(summarySheet, rowNum, ['Indicador', 'Valor'])
  rowNum++

  const summaryRows = [
    ['Total de productos', productos.length],
    ['Total de categorías', categorias.length],
    ['Unidades totales en existencia', totalStock],
    ['Valor total del inventario', inventoryValue],
    [`Productos con bajo inventario (≤ ${threshold})`, lowStock.length],
    ['Productos agotados', outOfStock.length],
    ['Entradas registradas', entradas.length],
    ['Unidades ingresadas', entradas.reduce((sum, m) => sum + m.cantidad, 0)],
    ['Salidas registradas', salidas.length],
    ['Unidades salientes', salidas.reduce((sum, m) => sum + m.cantidad, 0)]
  ]

  summaryRows.forEach((values, index) => {
    addDataRow(summarySheet, rowNum, values, index, values[0].includes('Valor total') ? [1] : [])
    rowNum++
  })

  const productSheet = workbook.addWorksheet('Productos', sheetOptions)
  productSheet.columns = [
    { width: 32 }, { width: 22 }, { width: 16 }, { width: 14 }, { width: 20 }, { width: 16 }
  ]
  rowNum = addSheetHeader(productSheet, 'Inventario de productos', 6)
  addTableHeaders(productSheet, rowNum, [
    'Producto', 'Categoría', 'Precio', 'Existencia', 'Valor', 'Estado'
  ])
  rowNum++

  productos.forEach((product, index) => {
    const estado =
      product.existencia === 0 ? 'AGOTADO' : product.existencia <= threshold ? 'BAJO' : 'OK'
    addDataRow(
      productSheet,
      rowNum,
      [
        product.nombre,
        product.categoria || 'Sin categoría',
        product.precio,
        product.existencia,
        product.existencia * product.precio,
        estado
      ],
      index,
      [2, 4]
    )
    const statusCell = productSheet.getCell(`F${rowNum}`)
    if (estado === 'AGOTADO') {
      statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: RED } }
    } else if (estado === 'BAJO') {
      statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: AMBER } }
    } else {
      statusCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: EMERALD } }
    }
    rowNum++
  })

  const categorySheet = workbook.addWorksheet('Por categoría', sheetOptions)
  categorySheet.columns = [{ width: 30 }, { width: 16 }, { width: 16 }, { width: 22 }]
  rowNum = addSheetHeader(categorySheet, 'Inventario por categoría', 4)
  addTableHeaders(categorySheet, rowNum, ['Categoría', 'Productos', 'Existencia', 'Valor'])
  rowNum++

  categorias.forEach((category, index) => {
    const categoryProducts = productos.filter((p) => p.categoria === category.nombre)
    addDataRow(
      categorySheet,
      rowNum,
      [
        category.nombre,
        categoryProducts.length,
        categoryProducts.reduce((sum, p) => sum + p.existencia, 0),
        categoryProducts.reduce((sum, p) => sum + p.existencia * p.precio, 0)
      ],
      index,
      [3]
    )
    rowNum++
  })

  const topSheet = workbook.addWorksheet('Más vendidos', sheetOptions)
  topSheet.columns = [{ width: 10 }, { width: 34 }, { width: 20 }, { width: 20 }]
  rowNum = addSheetHeader(topSheet, 'Productos más vendidos (según salidas)', 4)
  addTableHeaders(topSheet, rowNum, ['#', 'Producto', 'Unidades vendidas', 'Movimientos'])
  rowNum++

  const totals = {}
  for (const movement of salidas) {
    if (!movement.producto) continue
    const id = movement.producto._id
    if (!totals[id]) {
      totals[id] = { nombre: movement.producto.nombre, totalVendido: 0, count: 0 }
    }
    totals[id].totalVendido += movement.cantidad
    totals[id].count += 1
  }

  Object.values(totals)
    .sort((a, b) => b.totalVendido - a.totalVendido)
    .forEach((product, index) => {
      addDataRow(topSheet, rowNum, [index + 1, product.nombre, product.totalVendido, product.count], index)
      rowNum++
    })

  const noteRowNum = summaryRows.length + 7
  summarySheet.mergeCells(`A${noteRowNum}:B${noteRowNum}`)
  const noteCell = summarySheet.getCell(`A${noteRowNum}`)
  noteCell.value = `${productos.length} producto(s) · ${lowStock.length} con bajo stock · ${outOfStock.length} agotado(s)`
  noteCell.font = { name: 'Calibri', size: 10, italic: true, bold: true, color: { argb: EMERALD } }
  noteCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EMERALD_SOFT } }
  noteCell.alignment = { horizontal: 'center', vertical: 'middle' }

  return workbook
}
