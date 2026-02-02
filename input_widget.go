package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

type InputStyle int

type InputWidget struct {
	widget.BaseWidget
	Image fyne.CanvasObject //should be a canvas.Circle or canvas.Rectangle
}

func NewInputWidget(image fyne.CanvasObject) *InputWidget {
	input := &InputWidget{
		Image: image,
	}
	input.ExtendBaseWidget(input)
	return input
}

func (input *InputWidget) CreateRenderer() fyne.WidgetRenderer {
	c := container.NewBorder(nil, nil, nil, nil, input.Image)
	return widget.NewSimpleRenderer(c)
}
