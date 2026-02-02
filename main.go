package main

import (
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
)

func main() {
	myApp := app.New()
	myWindow := myApp.NewWindow("Visual APL")

	// rect := canvas.NewRectangle(color.White)
	// ability := NewAbilityWidget("Ability1", rect, true, true, 2, 2)
	// ability.Resize(fyne.NewSize(150, 150))
	// content := container.NewWithoutLayout(ability)

	// myWindow.SetContent(content)
	vcanvas := CreateVisualCanvas(fyne.NewSize(900, 900))
	myWindow.SetContent(vcanvas)
	myWindow.ShowAndRun()
}
