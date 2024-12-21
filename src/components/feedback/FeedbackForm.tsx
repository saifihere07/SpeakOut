import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";
import { Pencil2Icon } from "@radix-ui/react-icons";

type FeedbackFormProps = {
  onAddToList: (text: string) => void;
};

export default function FeedbackForm({ onAddToList }: FeedbackFormProps) {
  const [text, setText] = useState("");
  const [validIndicator, setValidIndicator] = useState(false);
  const [inValidIndicator, setInValidIndicator] = useState(false);

  const handleOnchange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length > MAX_CHARACTERS) {
      return;
    }
    setText(newText);
  };

  const charCount = MAX_CHARACTERS - text.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.includes("#") && text.length >= 5) {
      setValidIndicator(true);
      setTimeout(() => {
        setValidIndicator(false);
      }, 2000);
    } else {
      setInValidIndicator(true);
      setTimeout(() => {
        setInValidIndicator(false);
      }, 2000);
      return;
    }
    onAddToList(text);
    setText("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${validIndicator ? "form--valid" : ""} ${
        inValidIndicator ? "form--invalid" : ""
      }`}
    >
      <textarea
        onChange={handleOnchange}
        value={text}
        id="feedback-textarea"
        placeholder="blabla"
        spellCheck={false}
      />
      <label htmlFor="feedback-textarea">
        Enter your Feedback here, remember to #hashtag the comopany
        <Pencil2Icon />
      </label>
      <div>
        <p className="u-italic">{charCount}</p>
        <button>
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
