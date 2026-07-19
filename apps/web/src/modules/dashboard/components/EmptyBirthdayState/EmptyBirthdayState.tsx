import AddBirthday from "../AddBirthday/AddBirthday";

const EmptyBirthdayState = () => {
  return (
    <div>
      <h1 className="text-fs-2 mb-3">Welcome to Memora! 🎉</h1>

      <AddBirthday
        showMode={{
          mode: "text",
          text: "Start adding birthdays to remember and never miss a special day.",
          openModalText: "Add birthday",
        }}
      />
    </div>
  );
};

export default EmptyBirthdayState;
