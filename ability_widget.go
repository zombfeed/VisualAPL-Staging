package main

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

type AbilityWidget struct {
	widget.BaseWidget
	Title   *widget.Label
	Content fyne.CanvasObject
}

func NewAbilityWidget(title string, content fyne.CanvasObject) *AbilityWidget {
	item := &AbilityWidget{
		Title:   widget.NewLabel(title),
		Content: content,
	}

	item.Title.Truncation = fyne.TextTruncateEllipsis
	item.ExtendBaseWidget(item)
	return item
}

func (ability *AbilityWidget) CreateRenderer() fyne.WidgetRenderer {
	borders := createBorderRects()

	c := container.NewBorder(ability.Title, nil, nil, nil, ability.Content)
	containerWithBorder := container.NewBorder(borders[0], borders[1], borders[2], borders[3], c)
	return widget.NewSimpleRenderer(containerWithBorder)
}

func (ability *AbilityWidget) Dragged(event *fyne.DragEvent) {
	ability.Move(ability.Position().Add(event.Dragged))
	ability.Refresh()
}

func (ability *AbilityWidget) DragEnd() { ability.Refresh() }

func createBorderRects() []*canvas.Rectangle {
	borders := make([]*canvas.Rectangle, 4)
	for i := 0; i < 4; i++ {
		borders[i] = canvas.NewRectangle(color.Transparent)
		borders[i].StrokeColor = color.White
		borders[i].StrokeWidth = 2
	}
	return borders
}
