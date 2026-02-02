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
	Title        *widget.Label
	Content      fyne.CanvasObject
	HasInput     bool
	HasOutput    bool
	InputAmount  int
	OutputAmount int
}

func NewAbilityWidget(
	title string, content fyne.CanvasObject,
	input, output bool,
	inputAmount, outputAmount int) *AbilityWidget {
	ability := &AbilityWidget{
		Title:        widget.NewLabel(title),
		Content:      content,
		HasInput:     input,
		HasOutput:    output,
		InputAmount:  inputAmount,
		OutputAmount: outputAmount,
	}

	ability.Title.Truncation = fyne.TextTruncateEllipsis
	ability.ExtendBaseWidget(ability)
	return ability
}

func (ability *AbilityWidget) CreateRenderer() fyne.WidgetRenderer {
	borders := createBorderRects()
	iList := createInputList(ability.InputAmount)
	inputvbox := container.NewVBox(widget.NewLabel("Input"))
	for i := 0; i < ability.InputAmount; i++ {
		inputvbox.Add(iList[i])
	}
	oList := createOutputList(ability.OutputAmount)
	outputvbox := container.NewVBox(widget.NewLabel("Output"))
	for i := 0; i < ability.OutputAmount; i++ {
		outputvbox.Add(oList[i])
	}
	c := container.NewBorder(ability.Title, nil, inputvbox, outputvbox, ability.Content)
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

func createOutputList(n int) []*OutputWidget {
	output := []*OutputWidget{}
	if n == 0 {
		return output
	}

	for i := 0; i < n; i++ {
		rect := canvas.NewRectangle(color.White)
		rect.SetMinSize(fyne.NewSize(10, 10))
		rect.Refresh()
		o := NewOutputWidget(rect)
		output = append(output, o)
	}
	return output
}

func createInputList(n int) []*InputWidget {
	input := []*InputWidget{}
	if n == 0 {
		return input
	}
	for i := 0; i < n; i++ {
		rect := canvas.NewRectangle(color.White)
		rect.SetMinSize(fyne.NewSize(10, 10))
		o := NewInputWidget(rect)
		input = append(input, o)
	}
	return input
}
