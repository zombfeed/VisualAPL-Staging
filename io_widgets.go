package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

type InputStyle int
type OutputStyle int

type InputWidget struct {
	widget.BaseWidget
	Image fyne.CanvasObject //TODO: give this an actual image, instead of using canvas.Rectangles
}

type OutputWidget struct {
	widget.BaseWidget
	Image fyne.CanvasObject //TODO: give this an actual image, instead of using canvas.Rectangles
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
