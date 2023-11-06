"use client"

import {ReactNode, useEffect, useState} from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { dmsans } from '@root/styles/fonts';
import { ROQuestionType } from '@root/types/shared.types';

export const RankOrderQuestion = (props: {question: ROQuestionType, submitResponse: (s: Array<number>) => void, resetResponse: () => void}) => {
    const [items, setItems] = useState(props.question.userAnswer ?? props.question.options.map(o => o.oid));
    const sensors = useSensors(
        useSensor(MouseSensor, {activationConstraint: {distance: 8}}),
        useSensor(TouchSensor, {activationConstraint: {delay: 100, tolerance: 12}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    let sortableClassName = `${dmsans.className} w-full flex flex-row justify-between sm:text-xl text-md text-center rounded-md my-0.5 p-3 transition-all duration-100 active:scale-95`;
    if (props.question.userAnswer && props.question.correctAnswer) {
        if (props.question.userAnswer.join("") === props.question.correctAnswer.join("")) sortableClassName += " bg-green hover:bg-green-dark text-white";
        else sortableClassName += " bg-red hover:bg-red-dark text-white animate-wiggle";
    } else sortableClassName += " bg-white hover:bg-white-dark text-black";

    return (
        <div className="max-w-xl m-auto flex-col items-center justify-between py-6 px-6 border-2 border-white rounded bg-black">
            <h1 className={`${dmsans.className} sm:text-xl text-md my-4 text-white`}>{props.question.questionText}</h1>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={props.resetResponse}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                    { items.map(id => (
                        <Sortable
                            key={id}
                            id={id}
                            index={items.indexOf(id) + 1}
                            invertSvgColor={!props.question.userAnswer || !props.question.correctAnswer}
                            className={sortableClassName}
                        >
                            {props.question.options.find(o => o.oid === id)?.optionText}
                        </Sortable>
                    )) }
                </SortableContext>
            </DndContext>
            <button 
                className={`${dmsans.className} mt-2 p-4 w-full rounded-md bg-blue hover:bg-blue-dark active:scale-95 transition-all duration-100`} 
                onClick={() => props.submitResponse(items)}
            >{"Submit"}</button>
        </div>
    );
  
    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as number);
                const newIndex = items.indexOf(over.id as number);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
}

const Sortable = (props: {children: ReactNode, id: number, index: number, invertSvgColor: boolean, className?: string}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id});
    
    const style = { transform: CSS.Transform.toString(transform), touchAction: "none", transition };
    
    return (
        <button ref={setNodeRef} style={style} {...attributes} {...listeners} className={props.className}>
            <div className="flex flex-row flex-1 items-center text-left mr-3" >
                <img src="/images/misc/draggable.svg"  className={`h-4 mr-4 ${props.invertSvgColor ? "invert" : ""}`}/>
                {props.index}
            </div>
            <p>{props.children}</p>
            <div className="flex-1" />
        </button>
    );
  }
  