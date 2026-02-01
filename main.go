package main

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

// draggableRect custom type to handle dragging
type draggableRect struct {
	widget.Card
}

func (d *draggableRect) Dragged(ev *fyne.DragEvent) {
	d.Move(d.Position().Add(ev.Dragged))
}

func (d *draggableRect) DragEnd() {}

func NewDraggableCard(title, subtitle string, content fyne.CanvasObject) *draggableRect {
	c := &draggableRect{}
	c.ExtendBaseWidget(c)
	c.SetTitle(title)
	c.SetSubTitle(subtitle)
	c.SetContent(content)
	c.Resize(fyne.NewSize(250, 250))
	return c
}

func main() {
	myApp := app.New()
	myWindow := myApp.NewWindow("Draggable Rect")

	rect := canvas.NewRectangle(color.White)
	card := NewDraggableCard("card", "drag", rect)

	content := container.NewWithoutLayout(card)

	myWindow.SetContent(content)
	myWindow.Resize(fyne.NewSize(900, 900))
	myWindow.ShowAndRun()
}
