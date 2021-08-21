import React, { useState, useCallback } from 'react'

import type { PresetConfig } from '../config'

type PresetsProps = {
  presets: Array<PresetConfig>
  onDelete: (i: number) => void
}

import { DataGrid, GridColDef, GridEditRowsModel, GridEditRowProps } from '@material-ui/data-grid'
import { createTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    description: 'Preset Name',
    editable: true,
    sortable: false,
  },
  {
    field: 'quality',
    headerName: 'Quality',
    description: 'Overall score',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'description',
    headerName: 'Description',
    description: 'Text Score (randomizable)',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'cultural',
    headerName: 'Cultural',
    description: 'Historical Cultural Score (randomizable)',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'uniqueness',
    headerName: 'Uniqueness',
    description: 'Visually Unique Score (randomizable)',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'safety',
    headerName: 'Safety',
    description: 'Safe Access Score',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'location',
    headerName: 'Location',
    description: 'Location Score',
    editable: true,
    type: 'number',
    sortable: false,
  },
  {
    field: 'rng',
    headerName: 'Random',
    description: 'Apply randomizations',
    editable: true,
    type: 'boolean',
    sortable: false,
  },
]

const defaultTheme = createTheme()
const useStyles = makeStyles(
  () => {
    const isDark = false

    return {
      root: {
        '& .MuiDataGrid-cell--editing': {
          backgroundColor: 'rgb(255,215,115, 0.19)',
          color: '#1a3e72',
        },
        '& .Mui-error': {
          backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
          color: isDark ? '#ff4343' : '#750f0f',
        },
      },
    }
  },
  { defaultTheme },
)

const capValue = (val: number): number => {
  if (val > 5) {
    return 5
  }
  if (val < 0) {
    return 0
  }
  return val
}

const capModelValue = (model:GridEditRowProps, key:string) => {
  if (model[key]) {
    model[key].value = capValue(Number(model[key].value ?? 0));
  }
}

export const PresetsTable = ({ presets }: PresetsProps): JSX.Element => {
  const [editRowsModel, setEditRowsModel] = useState<GridEditRowsModel>({})
  const classes = useStyles()
  const handleEditRowsModelChange = useCallback(
    (newModel: GridEditRowsModel) => {
      const updatedModel = { ...newModel }
      Object.keys(updatedModel).forEach((id) => {
          capModelValue(updatedModel[id], 'quality');
          capModelValue(updatedModel[id], 'description');
          capModelValue(updatedModel[id], 'cultural');  
          capModelValue(updatedModel[id], 'uniqueness');
          capModelValue(updatedModel[id], 'safety');
          capModelValue(updatedModel[id], 'location');
      })
      console.log(updatedModel);
      setEditRowsModel(updatedModel)
      console.log(presets);
    },
    [],
  )

  const rows = presets.map(
    (
      {
        name,
        rng,
        score: { quality, description, cultural, uniqueness, safety, location },
      },
      id,
    ) => ({
      id,
      name,
      rng,
      quality,
      description,
      cultural,
      uniqueness,
      safety,
      location,
    }),
  )
  return (
    <div style={{ height: 400, width: '100%', minHeight: '25vh' }}>
      <DataGrid
        onCellEditCommit={(ev) => console.log(ev)}
        className={classes.root}
        rowHeight={25}
        rows={rows}
        columns={columns}
        hideFooterPagination
        disableSelectionOnClick
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        disableColumnMenu
      />
    </div>
  )
}
