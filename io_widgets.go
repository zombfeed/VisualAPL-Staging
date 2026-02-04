package main

import (
	"log"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/driver/desktop"
	"fyne.io/fyne/v2/widget"
)

type InputStyle int
type OutputStyle int

type InputWidget struct {
	widget.BaseWidget
	Image      fyne.CanvasObject //TODO: give this an actual image, instead of using canvas.Rectangles
	InitialPos fyne.Position
	Parent     *fyne.Container
}

type OutputWidget struct {
	widget.BaseWidget
	Image      fyne.CanvasObject //TODO: give this an actual image, instead of using canvas.Rectangles
	InitialPos fyne.Position
	Parent     *fyne.Container
}

//================================================================
// Interface Implementations
//================================================================

// Widget Interface
func (input *InputWidget) CreateRenderer() fyne.WidgetRenderer {
	c := container.NewBorder(nil, nil, nil, nil, input.Image)
	return widget.NewSimpleRenderer(c)
}

func (output *OutputWidget) CreateRenderer() fyne.WidgetRenderer {
	c := container.NewBorder(nil, nil, nil, nil, output.Image)
	return widget.NewSimpleRenderer(c)
}

// Draggable Interface
func (output *OutputWidget) Dragged(event *fyne.DragEvent) {
	output.Parent.Remove(output)
	output.Move(output.Position().Add(event.Dragged))
	output.Refresh()
}

func (output *OutputWidget) DragEnd() {
	output.Parent.Add(output)
	output.Move(output.InitialPos)
	output.Refresh()
}

func (input *InputWidget) Dragged(event *fyne.DragEvent) {
	input.Parent.Remove(input)
	input.Move(input.Position().Add(event.Dragged))
	input.Refresh()
}

func (input *InputWidget) DragEnd() {
	input.Parent.Add(input)
	input.Move(input.InitialPos)
	input.Refresh()
}

// Hoverable Interface
func (output *OutputWidget) MouseIn(event *desktop.MouseEvent) {
	log.Println("Output Mouse Detected")
}
func (output *OutputWidget) MouseMoved(event *desktop.MouseEvent) {}

func (output *OutputWidget) MouseOut() {}

func (input *InputWidget) MouseIn(event *desktop.MouseEvent) {
	log.Println("Input Mouse Detected")
}
func (input *InputWidget) MouseMoved(event *desktop.MouseEvent) {
}

func (input *InputWidget) MouseOut() {}

// Mouseable Interface
func (output *OutputWidget) MouseDown(event *desktop.MouseEvent) {
	log.Println("Output Mouse Down")
}
func (output *OutputWidget) Mouse(event *desktop.MouseEvent) {
	log.Println("Output Mouse Up")
}

func (input *InputWidget) MouseDown(event *desktop.MouseEvent) {
	log.Println("Input Mouse Down")
}
func (input *InputWidget) MouseUp(event *desktop.MouseEvent) {
	log.Println("Input Mouse Up")
}

//================================================================
// IO Widget Implementation
//================================================================

func NewInputWidget(image fyne.CanvasObject) *InputWidget {
	input := &InputWidget{
		Image: image,
	}
	input.ExtendBaseWidget(input)
	return input
}

func NewOutputWidget(image fyne.CanvasObject) *OutputWidget {
	output := &OutputWidget{
		Image: image,
	}
	output.ExtendBaseWidget(output)
	return output
}
