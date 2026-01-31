export default function NavItem({ iconLink, title }) {
  return (
    <div href="#" className="flex gap-3 items-center self-stretch px-4 py-3">
      <img src={iconLink} alt={`${title} icon`} className="w-5 h-5" />
      <span className="text-sm text-neutra-700 font-medium leading-5 -tracking-wider">
        {title}
      </span>
    </div>
  );
}
