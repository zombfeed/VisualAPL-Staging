package main

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
)

func main() {
	myApp := app.New()
	myWindow := myApp.NewWindow("Draggable Rect")

	rect := canvas.NewRectangle(color.White)
	// card := NewDraggableCard("card", "drag", rect)
	ability := NewAbilityWidget("Ability1", rect, true, true, 2, 2)
	ability.Resize(fyne.NewSize(250, 250))
	content := container.NewWithoutLayout(ability)

	myWindow.SetContent(content)
	myWindow.Resize(fyne.NewSize(900, 900))
	myWindow.ShowAndRun()
}
