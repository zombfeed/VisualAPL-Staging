package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

type OutputStyle int

type OutputWidget struct {
	widget.BaseWidget
	Image fyne.CanvasObject //should be a canvas.Circle or canvas.Rectangle
}

func NewOutputWidget(image fyne.CanvasObject) *OutputWidget {
	output := &OutputWidget{
		Image: image,
	}
	output.ExtendBaseWidget(output)
	return output
}

func (output *OutputWidget) CreateRenderer() fyne.WidgetRenderer {
	c := container.NewBorder(nil, nil, nil, nil, output.Image)
	return widget.NewSimpleRenderer(c)
}
