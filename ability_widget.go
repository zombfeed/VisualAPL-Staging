package main

import (
	"image/color"

	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/canvas"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

var ioSize = fyne.NewSize(10, 10)

type AbilityWidget struct {
	widget.BaseWidget
	Title        *widget.Label
	Content      fyne.CanvasObject
	HasInput     bool
	HasOutput    bool
	InputAmount  int
	OutputAmount int
	InputList    []*InputWidget
	OutputList   []*OutputWidget
}

//================================================================
// Interface Implementations
//================================================================

func (ability *AbilityWidget) Dragged(event *fyne.DragEvent) {
	ability.Move(ability.Position().Add(event.Dragged))
	ability.Refresh()
}

func (ability *AbilityWidget) DragEnd() { ability.Refresh() }

// ================================================================
// AbilityWidget Implementation
// ================================================================
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
		InputList:    make([]*InputWidget, inputAmount),
		OutputList:   make([]*OutputWidget, outputAmount),
	}

	ability.Title.Truncation = fyne.TextTruncateEllipsis
	ability.ExtendBaseWidget(ability)
	return ability
}

func (ability *AbilityWidget) CreateRenderer() fyne.WidgetRenderer {
	borders := createBorderRects()

	//iocontainer := container.NewWithoutLayout()
	// iocontainer.Resize(fyne.NewSize(150, 50))
	ability.InputList = createInputList(ability.InputAmount)
	inputvbox := container.NewVBox()
	for i := 0; i < ability.InputAmount; i++ {
		a := ability.InputList[i]
		inputvbox.Add(ability.InputList[i])
		a.InitialPos = a.Position()
		a.Parent = inputvbox

	}
	ability.OutputList = createOutputList(ability.OutputAmount)
	outputvbox := container.NewVBox()
	for i := 0; i < ability.OutputAmount; i++ {
		a := ability.OutputList[i]
		outputvbox.Add(a)
		a.InitialPos = a.Position()
		a.Parent = outputvbox
	}

	iocontainer := container.NewWithoutLayout(inputvbox, outputvbox)
	inputvbox.Resize(fyne.NewSize(10, 10))
	outputvbox.Resize(fyne.NewSize(10, 10))
	outputvbox.Move((fyne.NewPos(130, 0)))
	// inputvbox.Move(fyne.NewPos(5, 10))
	// outputvbox.Move(fyne.NewPos(130, 10))
	//iocontainer := container.NewGridWithColumns(2, inputvbox, outputvbox)

	c := container.NewBorder(ability.Title, iocontainer, nil, nil, ability.Content)
	containerWithBorder := container.NewBorder(borders[0], borders[1], borders[2], borders[3], c)
	return widget.NewSimpleRenderer(containerWithBorder)
}

func createOutputList(n int) []*OutputWidget {
	output := []*OutputWidget{}
	if n == 0 {
		return output
	}

	for i := 0; i < n; i++ {
		rect := canvas.NewRectangle(color.RGBA{255, 1, 1, 255})
		rect.SetMinSize(ioSize)
		rect.Refresh()
		w := NewOutputWidget(rect)
		output = append(output, w)
	}
	return output
}

func createInputList(n int) []*InputWidget {
	input := []*InputWidget{}
	if n == 0 {
		return input
	}
	for i := 0; i < n; i++ {
		rect := canvas.NewRectangle(color.RGBA{1, 1, 255, 255})
		rect.SetMinSize(ioSize)
		w := NewInputWidget(rect)
		input = append(input, w)
	}
	return input
}

func createBorderRects() []*canvas.Rectangle {
	borders := make([]*canvas.Rectangle, 4)
	for i := 0; i < 4; i++ {
		borders[i] = canvas.NewRectangle(color.Transparent)
		borders[i].StrokeColor = color.White
		borders[i].StrokeWidth = 2
	}
	return borders
}
