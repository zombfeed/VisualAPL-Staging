package main

import (
	"image/color"
	"log"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/theme"
	"fyne.io/fyne/v2/widget"
)

type VisualCanvas struct {
	fyne.Container
	Canvas   *fyne.Container
	selected *AbilityWidget

	Abilities []*AbilityWidget
}

func (vc *VisualCanvas) CreateVisualCanvas(size fyne.Size) *fyne.Container {
	// border layout
	// left border will be overview of all the ability nodes in the scene
	// right border will be properties of the selected node
	// bottom border will be console output
	// top border will be toolbar

	console := canvas.NewRectangle(color.White)
	overview := canvas.NewRectangle(color.White)
	properties := canvas.NewRectangle(color.White)
	vcanvas := container.NewWithoutLayout()

	toolbar := widget.NewToolbar(
		widget.NewToolbarAction(theme.DocumentCreateIcon(), func() {
			log.Println("New Document")
		}),
		widget.NewToolbarSeparator(),
		widget.NewToolbarAction(theme.ContentCutIcon(), func() {}),
		widget.NewToolbarAction(theme.ContentCopyIcon(), func() {}),
		widget.NewToolbarAction(theme.ContentPasteIcon(), func() {}),
		widget.NewToolbarSeparator(),
		widget.NewToolbarAction(theme.FolderNewIcon(), func() {
			node := vc.CreateNode()
			vcanvas.Add(node)
		}),
	)
	console.SetMinSize(fyne.NewSize(size.Width, 100))
	overview.SetMinSize(fyne.NewSize(100, size.Height))
	properties.SetMinSize(fyne.NewSize(100, size.Height))

	content := container.NewBorder(toolbar, console, overview, properties, vcanvas)
	content.Resize(size)
	vc.Canvas = content
	return vc.Canvas
}

func NewConsole() *fyne.CanvasObject {
	return nil
}

func (vc *VisualCanvas) CreateNode() *fyne.Container {
	rect := canvas.NewRectangle(color.White)
	ability := NewAbilityWidget("Ability1", rect, true, true, 2, 2)
	ability.Resize(fyne.NewSize(150, 150))
	content := container.NewWithoutLayout(ability)
	vc.Abilities = append(vc.Abilities, ability)
	return content
}
